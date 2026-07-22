import Select from "react-select";
import { AlertCircle } from "lucide-react";

const MultiSelectField = ({
    label,
    id,
    value,
    onChange,
    options,
    placeholder = "Select...",
    error,
    required = false,
    disabled = false,
}) => {

    // Convert string[] -> react-select option objects
    const selectOptions = options.map((item) => ({
        value: item,
        label: item,
    }));

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "46px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
            backgroundColor: "#f9fafb",
            boxShadow: "none",
            alignItems: "flex-start", // optional
            "&:hover": {
                borderColor: "#d1d5db",
            },
        }),

        valueContainer: (provided) => ({
            ...provided,
            padding: "6px 16px",
            display: "flex",
            flexWrap: "wrap",
            overflow: "visible",
        }),

        multiValue: (provided) => ({
            ...provided,
            margin: "2px",
        }),

        input: (provided) => ({
            ...provided,
            margin: "2px",
            padding: 0,
        }),

        indicatorsContainer: (provided) => ({
            ...provided,
            alignSelf: "stretch",
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#6b7280",
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#2563eb"
                : state.isFocused
                    ? "#dbeafe"
                    : "#fff",
            color: state.isSelected ? "#fff" : "#111827",
            cursor: "pointer",
            ":active": {
                backgroundColor: "#1d4ed8",
            },
        }),
    };

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Select
                inputId={id}
                isMulti
                isDisabled={disabled}
                styles={customStyles}
                // options={options}
                // value={options.filter((option) =>
                //     value.includes(option.value)
                // )}
                // onChange={(selected) =>
                //     onChange(selected.map((item) => item.value))
                // }
                options={selectOptions}
                value={selectOptions.filter(option =>
                    value.includes(option.value)
                )}
                onChange={(selected) =>
                    onChange(
                        selected
                            ? selected.map(item => item.value)
                            : []
                    )
                }
                placeholder={placeholder}
                // className="text-sm"
                classNamePrefix="react-select"
            />

            {error && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default MultiSelectField;