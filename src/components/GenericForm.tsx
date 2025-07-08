import { useForm } from "react-hook-form";
import type {
  SubmitHandler,
  FieldValues,
  DefaultValues,
  UseFormReturn,
} from "react-hook-form";
import * as LucideIcons from "lucide-react";
import { Button } from "./Button";

type LucideIconType = keyof typeof LucideIcons;

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: any;
  icon?: LucideIconType;
  autoComplete?: string;
};

type GenericFormProps<T extends FieldValues> = {
  fields: FormField[];
  onSubmit: SubmitHandler<T>;
  submitButtonText?: string;
  formClassName?: string;
  defaultValues?: DefaultValues<T>;
  showRememberMe?: boolean;
};

export const GenericForm = <T extends FieldValues>({
  fields,
  onSubmit,
  defaultValues,
  submitButtonText = "Submit",
  formClassName = "space-y-6",
  showRememberMe = false,
}: GenericFormProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ defaultValues }) as UseFormReturn<T>;

  return (
    <form
      className={formClassName}
      onSubmit={handleSubmit(onSubmit as SubmitHandler<T>)}
    >
      {fields.map((field) => {
        const IconComponent = field.icon
          ? (LucideIcons[field.icon] as React.ComponentType<{
              className: string;
            }>)
          : undefined;
        return (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
            >
              {field.label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              {IconComponent && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconComponent className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </div>
              )}
              <input
                id={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                className={`block w-full ${
                  field.icon ? "pl-10" : "pl-3"
                } pr-3 py-2 border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400
                  rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400
                  disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                  transition-colors duration-200
                  sm:text-sm`}
                placeholder={field.placeholder}
                {...register(field.name as any, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                  ...field.validation,
                })}
              />
            </div>
            {errors[field.name] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        );
      })}

      {showRememberMe && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 dark:text-indigo-500 
                focus:ring-indigo-500 dark:focus:ring-indigo-400 
                border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700
                rounded transition-colors duration-200"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300 transition-colors duration-200"
            >
              Remember me
            </label>
          </div>
        </div>
      )}

      <div>
        <Button type="submit" className="w-full">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
