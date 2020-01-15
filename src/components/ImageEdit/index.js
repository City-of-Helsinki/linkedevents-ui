import './index.scss'

import React from 'react';
import PropTypes from 'prop-types'
import {injectIntl, FormattedMessage} from 'react-intl'
import {
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography, withStyles,
} from '@material-ui/core'
import {Close} from '@material-ui/icons'
import {connect} from 'react-redux'
import HelTextField from '../HelFormFields/HelTextField'
import CONSTANTS from '../../constants'
import {postImage as postImageAction} from 'src/actions/userImages'
import {HelMaterialTheme} from '../../themes/material-ui'

const InlineRadioGroup = withStyles({
    root: {
        flexDirection: 'row',
    },
})(RadioGroup)

class ImageEdit extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            updateExisting: this.props.updateExisting || false,
            name: this.props.defaultName || '',
            photographerName: this.props.defaultPhotographerName || '',
            license: this.props.license || 'cc_by',
            nameMinLength: 6,
            nameMaxLength: CONSTANTS.CHARACTER_LIMIT.SHORT_STRING,
        }
    }

    handleImagePost() {
        let data = new FormData()
        if(!this.state.updateExisting) {
            if(this.props.imageFile) {
                data.append('image', this.props.imageFile)
            } else {
                data.append('url', this.props.thumbnailUrl)
            }
        }
        data.append('name', this.state.name)
        data.append('photographer_name', this.state.photographerName)
        data.append('license', this.state.license)
        this.props.postImage(
            data,
            this.props.user,
            this.state.updateExisting ? this.props.id : null
        )
        this.props.close()
    }

    handleTextChange(e, key) {
        this.setState({[key]: e.target.value})
    }
    handleLicenseChange = (e) => {
        this.setState({license: e.target.value})
    }
    render() {
        const {name, nameMinLength, nameMaxLength, license, photographerName} = this.state
        const {close} = this.props
        return (
            <Dialog
                className="image-edit-dialog"
                disableBackdropClick
                fullWidth
                maxWidth="lg"
                open={true}
                transitionDuration={0}
            >
                <DialogTitle>
                    <FormattedMessage id={'image-modal-image-info'}/>
                    <IconButton onClick={() => close()}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={() => this.handleImagePost()} className="row">
                        <div className="col-sm-8 image-edit-dialog--form">
                            <HelTextField
                                onChange={(e) => this.handleTextChange(e, 'name')}
                                defaultValue={name}
                                validations={[CONSTANTS.VALIDATION_RULES.SHORT_STRING]}
                                maxLength={nameMaxLength}
                                label={
                                    <FormattedMessage
                                        id={'image-caption-limit-for-min-and-max'}
                                        values={{
                                            minLength: nameMinLength,
                                            maxLength: nameMaxLength}}
                                    />
                                }
                            />
                            <TextField
                                fullWidth
                                label={<FormattedMessage id={'photographer'}/>}
                                value={photographerName}
                                onChange={(e) => this.handleTextChange(e, 'photographerName')}
                            />
                            <Typography
                                style={{marginTop: HelMaterialTheme.spacing(2)}}
                                variant="h6"
                            >
                                <FormattedMessage id={'image-modal-image-license'}/>
                            </Typography>
                            <InlineRadioGroup
                                aria-label="License"
                                name="license"
                                value={license}
                                onChange={this.handleLicenseChange}
                            >
                                <FormControlLabel
                                    value="cc_by"
                                    control={<Radio color="primary" />}
                                    label="Creative Commons BY 4.0"
                                />
                                <FormControlLabel
                                    value="event_only"
                                    control={<Radio color="primary" />}
                                    label={<FormattedMessage id={'image-modal-license-restricted-to-event'}/>}
                                />
                            </InlineRadioGroup>
                            <div
                                className="image-edit-dialog--help-notice"
                                style={{marginTop: HelMaterialTheme.spacing(2)}}
                            >
                                <FormattedMessage id={'image-modal-view-terms-paragraph-text'}/>
                                &nbsp;
                                <a href={'/help#images'} target={'_blank'}>
                                    <FormattedMessage id={'image-modal-view-terms-link-text'}/>
                                </a>
                            </div>
                        </div>
                        <img className="col-sm-4 image-edit-dialog--image" src={this.props.thumbnailUrl} />
                        <div className="col-sm-12">
                            <Button
                                fullWidth
                                type="submit"
                                color="primary"
                                variant="contained"
                                disabled={name.length < nameMinLength}
                                style={{margin: HelMaterialTheme.spacing(3, 0, 2)}}
                            >
                                Tallenna tiedot
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}
ImageEdit.propTypes = {
    updateExisting: PropTypes.bool,
    defaultName: PropTypes.string,
    defaultPhotographerName: PropTypes.string,
    license: PropTypes.string,
    imageFile: PropTypes.object,
    thumbnailUrl: PropTypes.string,
    postImage: PropTypes.func,
    user: PropTypes.object,
    id: PropTypes.number,
    close: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
    editor: state.editor,
    images: state.images,
})
const mapDispatchToProps = (dispatch) => ({
    postImage: (data, user, id) => dispatch(postImageAction(data, user, id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ImageEdit))
