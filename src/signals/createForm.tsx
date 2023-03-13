import { type JSX, batch } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { z } from "zod";

type SolidOnSubmit = JSX.EventHandlerUnion<
  HTMLFormElement,
  Event & {
    submitter: HTMLElement;
  }
>;

type FormStore<TSchema extends z.AnyZodObject> = {
  values: z.input<TSchema>;
  errors: { [_ in keyof z.input<TSchema>]-?: string[] };
};

export function createForm<
  TSchema extends z.ZodObject<
    { [y: string | number | symbol]: z.ZodSchema },
    "strip",
    z.ZodSchema
  >
>(schema: TSchema, defaultValues: Readonly<z.input<TSchema>>) {
  type SchemaInput = z.input<TSchema>;
  type SchemaOutput = z.output<TSchema>;
  const defaultErrors = Object.fromEntries(
    Object.entries(schema._def.shape()).map(
      ([key, _]) => [key, []] as [string, string[]]
    )
  ) as Readonly<{ [_ in keyof SchemaInput]-?: string[] }>;

  const [store, setStore] = createStore<FormStore<TSchema>>({
    values: { ...defaultValues },
    errors: { ...defaultErrors },
  });

  const actualizer = <TName extends keyof SchemaInput>(
    name: TName,
    value: SchemaInput[TName]
  ) => {
    const hadErrors = store.errors[name].length > 0;
    if (hadErrors) {
      batch(() => {
        setStore(produce((s) => (s.errors[name] = [])));
        const parseResult = schema.shape[name].safeParse(value);
        if (parseResult.success) return;
        setStore(
          produce((s) => {
            s.errors[name] = parseResult.error.flatten().formErrors;
          })
        );
      });
    }
    setStore(produce((store) => (store.values[name] = value)));
  };

  const handleSubmit: (cb: (values: SchemaOutput) => void) => SolidOnSubmit =
    (cb) => (e) => {
      e.preventDefault();
      const result = schema.safeParse(store.values);
      setStore("errors", defaultErrors);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors as {
          [_ in keyof z.input<typeof schema>]?: string[];
        };

        batch(() => {
          for (const key in errors) {
            const error = errors[key];
            if (!error) continue;
            setStore(produce((s) => (s.errors[key] = error)));
          }
        });

        return;
      }

      setStore("values", defaultValues);
      e.currentTarget.reset();

      return cb(result.data);
    };

  return {
    values: store.values,
    errors: store.errors,
    actualizer,
    handleSubmit,
  };
}
