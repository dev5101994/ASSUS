import { combineReducers } from 'redux';
import { IsInternetActiveReducer } from './IsInternetActiveReducer'
import { UserReducer } from './UserReducer'
import { LabelsReducer } from './LabelsReducer'
import { NavDataReducer } from './NavDataReducer';
import { MessagesDataReducer } from './MessagesDataReducer';
import { NetInfoDetailsReducer } from './NetInfoDetailsReducer';


const rootReducer = combineReducers({
    IsInternetActive: IsInternetActiveReducer,
    User: UserReducer,
    Labels: LabelsReducer,
    NavData: NavDataReducer,
    MessagesData: MessagesDataReducer,
    NetInfoDetails: NetInfoDetailsReducer
});

export default rootReducer;