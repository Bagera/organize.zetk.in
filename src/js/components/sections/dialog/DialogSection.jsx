import React from 'react/addons';

import SectionBase from '../SectionBase';
import PlaceholderPane from './PlaceholderPane';


export default class DialogSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'overview', title: 'Overview',
                startPane: PlaceholderPane }
        ];
    }
}