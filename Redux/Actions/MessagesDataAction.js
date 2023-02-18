import { chatData, allContactList, contactsWithMessages, socketMessagesReadyState, lastMessage, sendJsonMessage, onlineUsers, unreadMessages } from '../ActionTypes'

export function chatDataAction(value) {
    return (
        {
            type: chatData,
            payload: value
        }
    )
}

export function AllContactListAction(value) {
    return (
        {
            type: allContactList,
            payload: value
        }
    )
}

export function ContactsWithMessagesAction(value) {
    return (
        {
            type: contactsWithMessages,
            payload: value
        }
    )
}

export function SocketMessagesReadyStateAction(value) {
    return (
        {
            type: socketMessagesReadyState,
            payload: value
        }
    )
}

export function lastMessageAction(value) {
    return (
        {
            type: lastMessage,
            payload: value
        }
    )
}

export function SendJsonMessageAction(value) {
    return (
        {
            type: sendJsonMessage,
            payload: value
        }
    )
}

export function onlineUsersAction(value) {
    return (
        {
            type: onlineUsers,
            payload: value
        }
    )
}

export function unreadMessagesAction(value) {
    return (
        {
            type: unreadMessages,
            payload: value
        }
    )
}


