import Vue from 'Vue'
import Message from './src/main'

Message.installMessage = function (options, isSuccess, showClose) {
    if (options === undefined || options === null) {
        options = {
            dMessage: ''
        }
    } else if (typeof options === 'string' || typeof options === 'number') {
        options = {
            dMessage: options,
            dIsSuccess: isSuccess,
            dShowClose: showClose
        }
    }
    let message = Vue.extend(Message)

    let component = new message({
        data: options
    }).$mount()
    document.querySelector('body').appendChild(component.$el)
}

export default Message
