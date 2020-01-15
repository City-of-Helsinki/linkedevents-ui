import {createMuiTheme} from '@material-ui/core'
import helBrandColors from './hel/hel-brand-colors'

// constants
const SPACING = 8 // === 8px
const BUTTON_HEIGHT = '55px'
const BORDER_RADIUS = '2px'
const BORDER_WIDTH = '2px'
const TRANSITION_DURATION = '125ms'

let background = helBrandColors.coatBlue.main
let primary = helBrandColors.coatBlue
let secondary = helBrandColors.brick

if (appSettings.ui_mode === 'courses') {
    background = helBrandColors.tram.main
    primary = helBrandColors.tram
    secondary = helBrandColors.brick
}

export const HelMaterialTheme = createMuiTheme({
    spacing: SPACING,
    typography: {
        fontFamily: 'HelsinkiGrotesk, Roboto, sans-serif',
    },
    palette: {
        primary: primary,
        secondary: secondary,
        error: secondary,
        primary2Color: primary.dark,
        primary3Color: helBrandColors.gray.black70,
        accent1Color: primary.light,
        accent2Color: primary.main,
        accent3Color: helBrandColors.gray.black30,
        textColor: helBrandColors.gray.black,
        alternateTextColor: helBrandColors.gray.white,
        canvasColor: helBrandColors.gray.white,
        outline: 'none',
        borderColor: helBrandColors.gray.black30,
        disabledColor: helBrandColors.gray.black10,
        coat: helBrandColors.coatBlue,
        fob: helBrandColors.fog,
        tram: helBrandColors.tram,
        copper: helBrandColors.copper,
        gray: helBrandColors.gray,
        brick: helBrandColors.brick,
    },
    overrides: {
        MuiButtonBase: {
            root: {
                color: helBrandColors.gray.black,
            },
        },
        MuiButton: {
            root: {
                borderRadius: BORDER_RADIUS,
                height: BUTTON_HEIGHT,
                textTransform: 'none',
            },
            outlined: {
                borderColor: primary.main,
                borderWidth: BORDER_WIDTH,
                color: primary.main,
                '&:hover': {
                    backgroundColor: helBrandColors.gray.black10,
                },
            },
            iconSizeMedium: {
                '& > *:first-child': {
                    fontSize: '26px',
                },
            },
        },
        MuiIconButton: {
            root: {
                padding: `${SPACING}px`,
                '& svg': {
                    height: '1.2em',
                    width: '1.2em',
                },
            },
        },
        MuiFormControlLabel: {
            root: {
                marginBottom: 0,
            },
            label: {
                '&:first-letter': {
                    textTransform: 'capitalize',
                },
            },
        },
        MuiChip: {
            root: {
                marginRight: `${SPACING}px`,
                fontWeight: 500,
            },
            label: {
                '&:first-letter': {
                    textTransform: 'capitalize',
                },
            },
            deletableColorPrimary: {
                '&:focus': {
                    backgroundColor: primary.main,
                },
            },
        },
        MuiSvgIcon: {
            fontSizeLarge: {
                fontSize: '4.5rem',
            },
        },
        MuiTable: {
            root: {
                backgroundColor: 'white',
            },
        },
        MuiTableCell: {
            root: {
                padding: `${SPACING}px ${SPACING * 2}px`,
            },
        },
        MuiTableRow: {
            root: {
                '&$selected': {
                    backgroundColor: primary.lighter,
                },
            },
        },
        MuiTableSortLabel: {
            root: {
                color: helBrandColors.gray.black,
                opacity: 0.6,
                '&:hover': {
                    color: helBrandColors.gray.black,
                    opacity: 1,
                    transition: `opacity ${TRANSITION_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
                },
                '&.MuiTableSortLabel-active': {
                    color: helBrandColors.gray.black,
                },
            },
            active: {
                opacity: 1,
            },
            icon: {
                fontSize: '1.25rem',
                transitionDuration: TRANSITION_DURATION,
            },
        },
        MuiTablePagination: {
            actions: {
                '& .MuiSvgIcon-root': {
                    fontSize: '1.25rem',
                },
                '& .MuiIconButton-root:hover': {
                    backgroundColor: primary.lighter,
                },
            },
        },
        MuiMenuItem: {
            root: {
                '&$selected': {
                    backgroundColor: primary.main,
                    color: primary.contrastText,
                },
                '&$selected:hover': {
                    backgroundColor: primary.main,
                    color: primary.contrastText,
                },
                '&:hover': {
                    backgroundColor: primary.lighter,
                    color: helBrandColors.gray.black,
                },
            },
        },
        MuiSnackbarContent: {
            root: {
                backgroundColor: primary.main,
                color: primary.contrastText,
                '& .MuiButton-root': {
                    backgroundColor: 'transparent',
                    border: `${BORDER_WIDTH} solid white`,
                    color: 'inherit',
                },
            },
        },
        MuiTextField: {
            root: {
                color: helBrandColors.gray.black,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: primary.main,
                },
                margin: `${SPACING * 2}px 0 ${SPACING}px`,
            },
        },
        MuiOutlinedInput: {
            root: {
                backgroundColor: 'white',
                borderColor: primary.main,
            },
        },
        MuiDialogTitle: {
            root: {
                '& .MuiTypography-root': {
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                },
            },
        },
    },
})
