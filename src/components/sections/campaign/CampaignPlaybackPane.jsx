import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { getLocationAverage } from '../../../utils/location';
import { retrieveActions } from '../../../actions/action';
import { retrieveLocations } from '../../../actions/location';
import { retrieveActivities } from '../../../actions/activity';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => ({
    actions: state.actions,
    locations: state.locations,
    campaigns: state.campaigns,
    activityList: state.activities.activityList,
    filteredActionList: filteredActionList(state)
});

@connect(mapStateToProps)
export default class CampaignPlaybackPane extends CampaignSectionPaneBase {
    componentDidMount() {
        super.componentDidMount();

        if (!this.props.filteredActionList) {
            this.props.dispatch(retrieveActions());
            this.props.dispatch(retrieveActivities());
            this.props.dispatch(retrieveCampaigns());
        }

        this.props.dispatch(retrieveLocations());
    }

    renderPaneTop() {
        let actionList = this.props.filteredActionList;
        if (actionList && actionList.items) {
            let actions = actionList.items.map(i => i.data);

            return <ActionMiniCalendar actions={ actions }
                        onSelectDay={ this.onSelectDay.bind(this) }
                        onAddAction={ this.onCalendarAddAction.bind(this) }
                        onMoveAction={ this.onCalendarMoveAction.bind(this) }
                        onSelectAction={ this.onSelectAction.bind(this) }/>
        }
    }

    renderPaneContent() {
        let actionList = this.props.filteredActionList;
        if (actionList && actionList.items) {
            let actions = actionList.items.map(i => i.data);

            let locList = this.props.locations.locationList;
            let locations = locList.items.map(i => i.data);
            let center = getLocationAverage(locList);

            return (
                <CampaignPlayer key="player"
                    actions={ actions } locations={ locations }
                    centerLat={ center.lat } centerLng={ center.lng }/>
            );
        }
    }
}
