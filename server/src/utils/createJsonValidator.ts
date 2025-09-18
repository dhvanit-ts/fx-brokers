type PrimitiveType = "string" | "number" | "boolean" | "object" | "array";

interface SchemaNode {
  type: PrimitiveType;
  required?: boolean;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  tupleItems?: SchemaNode[];
  allowAdditionalProperties?: boolean;
  additionalProperties?: SchemaNode;
}

// Base builder (common methods)
class SchemaBuilder<T extends SchemaNode> {
  protected schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  optional(): SchemaBuilder<Omit<T, "required"> & { required?: boolean }> {
    return new SchemaBuilder({
      ...this.schema,
      required: false,
    }) as any;
  }

  build(): T {
    return this.schema;
  }
}

// Object schema builder
class ObjectSchemaBuilder<
  T extends SchemaNode & {
    type: "object";
    properties: Record<string, SchemaNode>;
  }
> extends SchemaBuilder<T> {
  extend<P extends Record<string, SchemaBuilder<any>>>(
    props: P
  ): ObjectSchemaBuilder<{
    type: "object";
    required: true;
    properties: T["properties"] & { [K in keyof P]: ReturnType<P[K]["build"]> };
  }> {
    return new ObjectSchemaBuilder({
      ...this.schema,
      properties: {
        ...(this.schema.properties ?? {}),
        ...Object.fromEntries(
          Object.entries(props).map(([k, v]) => [k, v.build()])
        ),
      } as T["properties"] & { [K in keyof P]: ReturnType<P[K]["build"]> },
    }) as any;
  }

  allowAdditionalProperties(): ObjectSchemaBuilder<
    T & { allowAdditionalProperties: true }
  > {
    return new ObjectSchemaBuilder({
      ...this.schema,
      allowAdditionalProperties: true,
    }) as any;
  }

  // ✅ New: allow typed additional fields
  additionalProperties<P extends SchemaBuilder<any>>(
    schema: P
  ): ObjectSchemaBuilder<T & { additionalProperties: ReturnType<P["build"]> }> {
    return new ObjectSchemaBuilder({
      ...this.schema,
      additionalProperties: schema.build(),
    }) as any;
  }
}

// Array schema builder
class ArraySchemaBuilder<
  T extends SchemaNode & { type: "array" }
> extends SchemaBuilder<T> {
  of<I extends SchemaBuilder<any>>(
    item: I
  ): ArraySchemaBuilder<T & { items: ReturnType<I["build"]> }> {
    return new ArraySchemaBuilder({
      ...this.schema,
      items: item.build(),
    }) as any;
  }
}

// Helpers
export const S = {
  string: () =>
    new SchemaBuilder<{ type: "string"; required: true }>({
      type: "string",
      required: true,
    }),
  number: () =>
    new SchemaBuilder<{ type: "number"; required: true }>({
      type: "number",
      required: true,
    }),
  boolean: () =>
    new SchemaBuilder<{ type: "boolean"; required: true }>({
      type: "boolean",
      required: true,
    }),
  object: <P extends Record<string, SchemaBuilder<SchemaNode>>>(props: P) =>
    new ObjectSchemaBuilder<{
      type: "object";
      required: true;
      properties: { [K in keyof P]: ReturnType<P[K]["build"]> };
    }>({
      type: "object",
      required: true,
      properties: Object.fromEntries(
        Object.entries(props).map(([k, v]) => [k, v.build()])
      ) as { [K in keyof P]: ReturnType<P[K]["build"]> },
    }),
  array: <I extends SchemaBuilder<SchemaNode>[]>(...items: I) => {
    if (items.length === 0) {
      return new ArraySchemaBuilder<{ type: "array"; required: true }>({
        type: "array",
        required: true,
      });
    } else if (items.length === 1) {
      return new ArraySchemaBuilder<{
        type: "array";
        required: true;
        items: ReturnType<I[0]["build"]>;
      }>({
        type: "array",
        required: true,
        items: items[0].build() as ReturnType<I[0]["build"]>,
      });
    } else {
      return new ArraySchemaBuilder<{
        type: "array";
        required: true;
        tupleItems: { [K in keyof I]: ReturnType<I[K]["build"]> };
      }>({
        type: "array",
        required: true,
        tupleItems: items.map((i) => i.build()) as {
          [K in keyof I]: ReturnType<I[K]["build"]>;
        },
      });
    }
  },
};

// Validator
export function createJsonValidator(schema: SchemaNode) {
  function validate(value: unknown, schema: SchemaNode, path: string = "") {
    const { type, required, properties, items } = schema;

    if (value === undefined || value === null) {
      if (required) throw new Error(`${path || "Value"} is required`);
      else return;
    }

    const actualType = Array.isArray(value)
      ? "array"
      : typeof value === "object"
      ? "object"
      : typeof value;

    if (actualType !== type) {
      throw new Error(
        `${path || "Value"} must be of type ${type}, got ${actualType}`
      );
    }

    if (type === "object" && properties) {
      const keys = Object.keys(properties);
      for (const key of keys) {
        validate(
          (value as Record<string, unknown>)[key],
          properties[key],
          path ? `${path}.${key}` : key
        );
      }

      const valueKeys = Object.keys(value as Record<string, unknown>);

      for (const key of valueKeys) {
        if (!keys.includes(key)) {
          if (schema.additionalProperties) {
            // validate against schema
            validate(
              (value as Record<string, unknown>)[key],
              schema.additionalProperties,
              path ? `${path}.${key}` : key
            );
          } else if (!schema.allowAdditionalProperties) {
            throw new Error(
              `Unexpected field: ${path ? path + "." : ""}${key}`
            );
          }
        }
      }
    }

    if (type === "array") {
      if (schema.tupleItems) {
        if ((value as unknown[]).length !== schema.tupleItems.length) {
          throw new Error(
            `${path || "Value"} must have exactly ${
              schema.tupleItems.length
            } items`
          );
        }
        (value as unknown[]).forEach((item, index) =>
          validate(item, schema.tupleItems![index], `${path}[${index}]`)
        );
      } else if (items) {
        (value as unknown[]).forEach((item, index) =>
          validate(item, items, `${path}[${index}]`)
        );
      }
    }
  }

  return (value: unknown) => validate(value, schema);
}
