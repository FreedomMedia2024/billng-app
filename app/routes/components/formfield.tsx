import formfieldCSS from "app/routes/components/components.module.css"
interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value: any
    onChange?: (...args: any) => any
  }
  
  export function FormField({ htmlFor, label, type = 'text', value, onChange = () => {} }: FormFieldProps) {
    return (
      <div className={formfieldCSS.formfield}>
        <label htmlFor={htmlFor} className={formfieldCSS.label}>
          {label}
        </label>
        <input
          onChange={onChange}
          type={type}
          id={htmlFor}
          name={htmlFor}
          className={formfieldCSS.fieldinput}
          value={value}
        />
      </div>
    )
  }