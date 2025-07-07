import React, { useState } from 'react';

const Multiselect = ({ options, selected, onChange, placeholder }) => {
    const [dropdown, setDropdown] = useState(false);

    const toggleDropdown = () => setDropdown(!dropdown);

    const addTag = (item) => {
        if (!selected.find((s) => s.value === item.value)) {
            onChange([...selected, item]); // Add the full object
        }
        setDropdown(false);
    };

    const removeTag = (item) => {
        onChange(selected.filter((s) => s.value !== item.value));
    };

    return (
        <div className="autocomplete-wrapper relative">
            <div className="autocomplete">
                <div className="flex flex-wrap items-center border rounded-md p-1 bg-transparent border-blue-gray-200">
                    {selected.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center m-1 py-1 px-2 bg-teal-100 text-teal-700 rounded-full"
                        >
                            <span className="text-xs">{tag.label}</span>
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-teal-700 hover:text-teal-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <input
                        placeholder={placeholder}
                        className="flex-1 p-1 outline-0 outline text-black font-sans cursor-pointer caret-transparent bg-transparent"
                        onFocus={toggleDropdown}
                    />
                </div>
                {dropdown && (
                    <div className="absolute shadow bg-white z-40 w-full rounded max-h-48 overflow-y-auto">
                        {options.map((item, key) => (
                            <div
                                key={key}
                                className="cursor-pointer p-2 hover:bg-teal-100"
                                onClick={() => addTag(item)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Multiselect;