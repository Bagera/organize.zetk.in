import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import React from 'react';

import ContactSlot from '../lists/items/elements/ContactSlot';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import ParticipantList from '../lists/items/elements/ParticipantList';
import { getListItemById } from '../../utils/store';
import { retrieveAction, updateAction } from '../../actions/action';
import {
    addActionParticipant,
    retrieveActionParticipants,
} from '../../actions/participant';


const actionTarget = {
    canDrop(props, monitor) {
        let person = monitor.getItem();
        let actionId = props.paneData.params[0];
        let participants = props.participants.byAction[actionId];
        let duplicate = participants.find(p => (p.id == person.id));

        // Only allow drops if it wouldn't result in duplicate
        return (duplicate === undefined);
    },

    drop(props) {
        let actionId = props.paneData.params[0];

        return {
            targetType: 'actionParticipant',
            onDropPerson: person => {
                props.dispatch(addActionParticipant(
                    person.id, actionId));
            },
        };
    }
};

function collectParticipant(connect, monitor) {
    return {
        connectParticipantDropTarget: connect.dropTarget(),
        isParticipantOver: monitor.isOver(),
        canDropParticipant: monitor.canDrop()
    };
}

const contactTarget = {
    canDrop(props, monitor) {
        return true;
    },

    drop(props) {
        // TODO: Use generalized onDropPerson instead
        let actionId = props.paneData.params[0];

        return {
            targetType: 'contact',
            onSetContact: person => {
                props.dispatch(updateAction(actionId, {
                    contact_id: person.id
                }));
            }
        }
    }
};

function collectContact(connect, monitor) {
    return {
        connectContactDropTarget: connect.dropTarget(),
        isContactOver: monitor.isOver(),
        canDropContact: monitor.canDrop()
    };
}


let select = state => ({
    actions: state.actions,
    participants: state.participants,
});


@connect(select)
@DropTarget('person', actionTarget, collectParticipant)
@DropTarget('person', contactTarget, collectContact)
export default class ActionPane extends PaneBase {
    componentDidMount() {
        let actionId = this.getParam(0);

        this.props.dispatch(retrieveAction(actionId));

        if (!this.props.participants.byAction[actionId]) {
            this.props.dispatch(retrieveActionParticipants(actionId));
        }
    }

    getRenderData() {
        let actionId = this.getParam(0);
        let actionList = this.props.actions.actionList;

        return {
            actionItem: getListItemById(actionList, actionId),
        }
    }

    getPaneTitle(data) {
        if (data.actionItem && data.actionItem.data) {
            let action = data.actionItem.data;
            return 'Action: ' + action.activity.title;
        }
        else {
            return 'Action';
        }
    }

    getPaneSubTitle(data) {
        if (data.actionItem && data.actionItem.data) {
            let action = data.actionItem.data;
            let startDate = Date.utc.create(action.start_time);
            let timeLabel = startDate.setUTC(true)
                .format('{yyyy}-{MM}-{dd}, {HH}:{mm}');

            return action.location.title + ', ' + timeLabel;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        if (data.actionItem) {
            let action = data.actionItem.data;
            let participants = this.props.participants.byAction[action.id];

            let participantList = this.props.connectParticipantDropTarget(
                <div className="ActionPane-participantDropTarget">
                    <ParticipantList participants={ participants }/>
                </div>
            );

            let contactSlot = this.props.connectContactDropTarget(
                <div className="ActionPane-contactDropTarget">
                    <ContactSlot
                        contact={ action.contact }/>
                </div>
            );

            return [
                <div key="summary"
                    className="ActionPane-summary">
                    <span className="ActionPane-info">
                        { action.info_text }
                    </span>
                    <a onClick={ this.onClickEdit.bind(this) }>
                        Edit details</a>
                </div>,

                <div key="contact"
                    className="ActionPane-contact">
                    <h3>Contact person</h3>
                    { contactSlot }
                </div>,

                <div key="participants"
                    className="ActionPane-participants">
                    <h3>Participants</h3>
                    <p>
                        <a onClick={ this.onClickReminders.bind(this) }>
                            Send reminders</a>
                    </p>
                    { participantList }
                </div>,

                <div key="responses"
                    className="ActionPane-responses">
                    <h3>Responses</h3>
                </div>
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onClickEdit(ev) {
        let actionId = this.getParam(0);
        this.openPane('editaction', actionId);
    }

    onClickReminders(ev) {
        let actionId = this.getParam(0);
        this.openPane('actionreminder', actionId);
    }
}