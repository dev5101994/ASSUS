import { chatData, allContactList, contactsWithMessages, socketMessagesReadyState, lastMessage, sendJsonMessage, onlineUsers, unreadMessages } from '../ActionTypes'

const defaultObject = {
    data: [],
    isLoading: false,
    paginationLoading: false,
    isRefreshing: false,
    page: 0,
    stopLoadingMore: false
}

const initialState = {
    chatData: { ...defaultObject },
    allContactList: { ...defaultObject },
    contactsWithMessages: { ...defaultObject },
    socketMessagesReadyState: null,
    lastMessage: null,
    sendJsonMessage: null,
    onlineUsers: {},
    unreadMessages: 0
};

export function MessagesDataReducer(state = initialState, action) {

    switch (action.type) {
        case chatData:
            return { ...state, chatData: { ...state.chatData, ...action.payload } }
        case allContactList:
            return { ...state, allContactList: { ...state.allContactList, ...action.payload } }
        case contactsWithMessages:
            return { ...state, contactsWithMessages: { ...state.contactsWithMessages, ...action.payload } }
        case socketMessagesReadyState:
            return { ...state, socketMessagesReadyState: action.payload }
        case sendJsonMessage:
            return { ...state, sendJsonMessage: action.payload }
        case lastMessage:
            return { ...state, lastMessage: action.payload }
        case onlineUsers:
            return { ...state, onlineUsers: action.payload }
        case unreadMessages:
            return { ...state, unreadMessages: action.payload }
        default:
            return state
    }
}