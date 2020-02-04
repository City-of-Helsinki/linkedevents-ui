import './Terms.scss'

import React from 'react'
import {FormattedMessage} from 'react-intl'

const Terms = () => (
    <div className="container terms-page">
        <h1><FormattedMessage id={'terms-heading'} /></h1>
<p>Linked Events –tapahtumarajapintaan lisätyt tapahtumatiedot, kuvat ja muu materiaali (yhdessä <em>Materiaali</em>) julkaistaan Creative Commons BY 4.0 -lisenssillä, ellei toisin mainita. </p>
<p>Käyttämällä rajapintaa Materiaalia lisännyt palvelun käyttäjä hyväksyy Materiaalin julkaisemisen Creative Commons BY 4.0 –lisenssillä, lukuun ottamatta tilanteita, joissa kuvan rajapinnan kautta lisännyt rajoittaa kuvan käyttöoikeutta jäljempänä kuvatulla tavalla. Creative Commons BY 4.0 –lisenssiehdot löytyvät oheisesta linkistä:</p>
<p><a href="http://creativecommons.org/licenses/by/4.0/deed.fi">Creative Commons BY 4.0 -lisenssin täydellinen määritelmä »</a></p>
<p>Rajapintaan syötetyn kuvan käyttöä on mahdollista rajoittaa kuvakohtaisesti kyseiseen yksittäiseen tapahtumaan liittyen (Event only –lisenssi). Käyttöoikeuden rajoitus sitoo rajapintaa käyttäviä sovelluksia ja muita rajapinnan käyttäjiä:</p>
<p>Mikäli jaettavan kuvan tietojen kohdassa ”Lisenssi” on merkintä ”Käyttö rajattu tapahtuman yhteyteen”, saa Linked Events -tapahtumarajapinnassa olevaa kuvaa käyttää ainoastaan kuvan tapahtumaa käsittelevään tiedotukseen ja viestintään. Kuvan käyttö tai siirto muihin tarkoituksiin on kielletty. Kuvia käytettäessä on ehdottomasti mainittava kuvien lähde ja kuvaaja.</p>
<p>Materiaalia palveluun lisäävä palvelun käyttäjä takaa, että hänellä on tarvittavat oikeudet Materiaalin lisäämiseen palveluun. Helsingin kaupunki ei vastaa Materiaalin sisällöstä tai siihen liittyvistä immateriaalioikeuksista. Materiaalin palveluun lisännyt palvelun käyttäjä vastaa lisäämästään materiaalista ja siitä, ettei se loukkaa kolmannen osapuolen immateriaali- tai muita oikeuksia ja ettei se ole sisällöltään muutoin lain tai hyvän tavan vastainen.</p>
<p>Helsingin kaupunki ei takaa palvelun käyttäjien sivulle lisäämien Materiaalien oikeellisuutta eikä vastaa niiden virheellisyydestä.</p>
<p>Helsingin kaupungilla on kaikki oikeudet muokata ja poistaa tapahtumarajapintaan syötettyjä Materiaaleja. Helsingin kaupunki ei sitoudu julkaisemaan mitään Materiaaleja.</p>
    </div>
)

export default Terms
