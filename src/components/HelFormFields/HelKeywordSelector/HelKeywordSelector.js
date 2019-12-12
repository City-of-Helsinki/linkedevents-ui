import {HelLabeledCheckboxGroup, HelSelect} from '../index'
import {FormattedMessage} from 'react-intl'
import SelectedKeywords from '../../SelectedKeywords/SelectedKeywords'
import React from 'react'
import {SideField} from '../../FormFields'
import {get, uniqBy} from 'lodash'
import {mapKeywordSetToForm} from '../../../utils/apiDataMapping'
import {setData as setDataAction} from '../../../actions/editor'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {ContentCopy} from 'material-ui-icons'

const HelKeywordSelector = (props) => {
    const {intl, setDirtyState, setData} = props
    const {values, keywordSets, validationErrors} = props.editor

    const keywords = get(values, 'keywords', [])
    const mainCategoryOptions = mapKeywordSetToForm(keywordSets, 'helsinki:topics')

    const handleKeywordChange = (checkedOptions) => {
        let updatedKeywords = []

        if (Array.isArray(checkedOptions)) {
            const mainCategoryValues = mainCategoryOptions.map(item => item.value)
            const mappedMainCategoryKeywords = mainCategoryOptions.filter(item => checkedOptions.includes(item.value))
            const nonMainCategoryKeywords = keywords.filter(item => !mainCategoryValues.includes(item.value))

            updatedKeywords = uniqBy([...mappedMainCategoryKeywords, ...nonMainCategoryKeywords], 'value')
        } else {
            updatedKeywords = uniqBy([...keywords, checkedOptions], 'value')
        }

        setData({keywords: updatedKeywords})
    }

    const handleKeywordDelete = (deletedItem) => {
        const updatedSelectedKeywords = keywords
            .filter(item => item.value !== deletedItem.value)

        setData({keywords: updatedSelectedKeywords})
    }

    const getKeywordIds = () => keywords
        .map(item => {
            const value = item.value
            const searchKey = 'keyword/'
            const startIndex = value.indexOf(searchKey) + searchKey.length
            const endIndex = value.length - 1

            return value.substring(startIndex, endIndex)
        })
        .join()

    return (
        <React.Fragment>
            <HelLabeledCheckboxGroup
                groupLabel={<FormattedMessage id="main-categories"/>}
                selectedValues={values['keywords']}
                name="keywords"
                validationErrors={validationErrors['keywords']}
                itemClassName="col-md-12 col-lg-6"
                options={mainCategoryOptions}
                setDirtyState={setDirtyState}
                customOnChangeHandler={handleKeywordChange}
            />
            <SideField>
                <p className="tip">
                    <FormattedMessage id="editor-tip-hel-main-category"/>
                </p>
            </SideField>
            <div className="col-sm-6 hel-select">
                <HelSelect
                    legend={intl.formatMessage({id: 'event-keywords'})}
                    name="keywords"
                    resource="keyword"
                    setDirtyState={setDirtyState}
                    customOnChangeHandler={handleKeywordChange}
                />
                <CopyToClipboard text={values['keywords'] ? getKeywordIds() : ''}>
                    <button className="clipboard-copy-button" title={intl.formatMessage({id: 'copy-to-clipboard'})}>
                        <ContentCopy />
                    </button>
                </CopyToClipboard>
                <SelectedKeywords
                    selectedKeywords={keywords}
                    onDelete={handleKeywordDelete}
                />
            </div>
            <SideField>
                <p className="tip">
                    <FormattedMessage id="editor-tip-keywords"/>
                </p>
            </SideField>
        </React.Fragment>
    )
}

HelKeywordSelector.propTypes = {
    intl: PropTypes.object,
    setData: PropTypes.func,
    setDirtyState: PropTypes.func,
    editor: PropTypes.object,
}

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
})

export default connect(null, mapDispatchToProps)(HelKeywordSelector)
