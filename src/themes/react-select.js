import helBrandColors from './hel/hel-brand-colors'

const singleValueStyles = (provided) => ({
    ...provided,
    color: helBrandColors.gray.black90,
})
const menuListStyles = (provided) => ({
    ...provided,
    backgroundColor: helBrandColors.gray.white,
    borderRadius: 2,
})
const optionStyles = (provided, {isSelected, isFocused}) => ({
    ...provided,
    backgroundColor: isSelected
        // selected
        ? helBrandColors.coatBlue.main
        : isFocused
            // focused but not selected
            ? helBrandColors.coatBlue.lighter
            // not focused and not selected
            : helBrandColors.coatBlue.contrastText,
    color: isSelected
        ? helBrandColors.coatBlue.contrastText
        : helBrandColors.gray.black90,
    ':hover': {
        ...provided[':hover'],
        backgroundColor: isSelected
            ? helBrandColors.coatBlue.main
            : helBrandColors.coatBlue.lighter,
    },
})

export const HelSelectStyles = {
    singleValue: singleValueStyles,
    menuList: menuListStyles,
    option: optionStyles,
}

export const HelLanguageSelectStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: 'transparent',
        border: '0',
        cursor: 'pointer',
        width: 55,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: helBrandColors.coatBlue.contrastText,
        fontWeight: 'bold',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: helBrandColors.coatBlue.contrastText,
        padding: 0,
        ':hover': {
            color: helBrandColors.coatBlue.contrastText,
        },
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    menuList: menuListStyles,
    option: (provided, state) => ({
        ...optionStyles(provided, state),
        textAlign: 'center',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
}

export const HelSelectTheme = (theme) => ({
    ...theme,
    borderRadius: 2,
    colors: {
        ...theme.colors,
        primary: helBrandColors.coatBlue.main,
        danger: helBrandColors.error.main,
    },
})
