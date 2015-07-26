import React from 'react/addons';
import { Link } from 'react-router-component';

import PaneUtils from '../../utils/PaneUtils';
import PaneManager from '../../utils/PaneManager';
import FluxComponent from '../FluxComponent';


export default class SectionBase extends FluxComponent {
    componentDidMount() {
        var panes = [];
        var containerDOMNode;

        Object.keys(this.refs)
            .filter(key => (key.indexOf('pane') == 0 && key != 'paneContainer'))
            .sort()
            .map(function(key) {
                var paneDOMNode = React.findDOMNode(this.refs[key]);
                panes.push(paneDOMNode);
            }, this);

        containerDOMNode = React.findDOMNode(this.refs.paneContainer);
        PaneManager.run(panes, containerDOMNode);
    }

    componentWillUnmount() {
        // TODO: Shut down page manager
    }

    render() {
        var Pane;
        var panes = [];
        var panePath;
        var router = this.context.router;
        var subSections = this.getSubSections();
        var basePath = router.getMatch().matchedPath;

        var i;
        var subPath = router.getMatch().unmatchedPath;

        if (!subPath) {
            Pane = subSections[0].startPane;
            panePath = basePath + '/' + subSections[0].path;
            panes.push(
                <Pane ref="pane0" key={ subSections[0].path }
                        panePath={ panePath }/>);
        }
        else {
            var subPathSegments = subPath.split('/');

            for (i = 0; i < subSections.length; i++) {
                var section = subSections[i];
                if (section.path == subPathSegments[0]) {
                    Pane = section.startPane;
                    panePath = basePath + '/' + section.path;
                    panes.push(
                        <Pane ref="pane0" key={ section.path }
                            panePath={ panePath }/>);
                    break;
                }
            }

            for (i = 1; i < subPathSegments.length; i++) {
                var segment = subPathSegments[i];
                var segmentData = segment.split(':');
                var paneName = segmentData[0];
                var paneParams = [];

                if (segmentData.length == 2) {
                    paneParams = segmentData[1].split(',');
                }

                panePath = basePath + '/' + subPathSegments.slice(0, i).join('/');

                Pane = PaneUtils.resolve(paneName);
                panes.push(
                    <Pane ref={ 'pane' + i } key={ segment }
                        panePath={ panePath } params={ paneParams }/>
                );
            }
        }

        return (
            <div className="section">
                <nav className="section-nav">
                    <ul>
                        { subSections.map(function(subData) {
                            var path = basePath + '/' + subData.path;
                            return (
                                <li key={ subData.path }>
                                    <Link href={ path}>
                                        { subData.title }
                                    </Link>
                                </li>
                            );
                        }, this)}
                        <li key="back"><Link href="/">Dashboard</Link></li>
                    </ul>
                </nav>
                <div className="section-content" ref="paneContainer">
                    { panes }
                </div>
            </div>
        );
    }

    getSubSections() {
        return [];
    }

    renderSectionContent() {
        throw "renderSectionContent() not implemented";
    }
}

SectionBase.contextTypes.router = React.PropTypes.any
