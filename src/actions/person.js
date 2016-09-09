import * as types from './';


export function createPerson(data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.CREATE_PERSON,
            payload: {
                promise: z.resource('orgs', orgId, 'people').post(data)
            }
        });
    };
}

export function retrievePeople() {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PEOPLE,
            payload: {
                promise: z.resource('orgs', orgId, 'people').get()
            }
        });
    };
}

export function retrievePerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.RETRIEVE_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).get()
            }
        });
    };
}

export function updatePerson(id, data) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.UPDATE_PERSON,
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).patch(data)
            }
        });
    };
}

export function deletePerson(id) {
    return ({ dispatch, getState, z }) => {
        let orgId = getState().org.activeId;
        dispatch({
            type: types.DELETE_PERSON,
            meta: { id },
            payload: {
                promise: z.resource('orgs', orgId, 'people', id).del()
            }
        });
    };
}
