export function mapKeywordSetToForm(keywordSets, id, locale = 'fi') {
    let keywordSet = _.findWhere(keywordSets, {'id': id})
    if(keywordSet && keywordSet.keywords) {
        return keywordSet.keywords.map((item) => ({
            value: `/v0.1/keyword/${item.id}/`,
            label: item.name[locale]
        }))
    }

    else {
        return []
    }
}
