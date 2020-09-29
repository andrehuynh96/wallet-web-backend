const objectMapper = require('object-mapper');

const destObject = {
    array: {
        '[].Notification.id': '[].id',
        '[].Notification.description': '[].description',
        '[].Notification.type': '[].type',
        '[].Notification.event': '[].event',
        '[].read_flg': '[].read_flg',
        '[].createdAt': '[].created_at',
        '[].updatedAt': '[].updated_at'
    },
    single: {
        'Notification.id': 'id',
        'Notification.description': 'description',
        'Notification.type': 'type',
        'Notification.event': 'event',
        read_flg: 'read_flg',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};
module.exports = (srcObject, selected_lang) => {
    if (selected_lang && selected_lang != 'en')
        selected_lang = '_' + selected_lang;
    else
        selected_lang = '';

    let destCloned = JSON.parse(JSON.stringify(destObject)); // Object.assign({}, destObject);
    destCloned.array[`[].Notification.title${selected_lang}`] = '[].title';
    destCloned.array[`[].Notification.content${selected_lang}`] = '[].content';
    destCloned.single[`Notification.title${selected_lang}`] = 'title';
    destCloned.single[`Notification.content${selected_lang}`] = 'content';

    if (Array.isArray(srcObject)) {
        if (srcObject === undefined || srcObject.length == 0) {
            return srcObject;
        } else {
            return objectMapper(srcObject, destCloned.array);
        }
    } else {
        return objectMapper(srcObject, destCloned.single);
    }
};