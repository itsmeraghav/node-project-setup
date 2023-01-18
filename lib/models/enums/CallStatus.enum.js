const CallStatus = Object.freeze({
    Cancel: 'Cancel',
    Dropped: 'Dropped',
    Complete: 'Complete',
    InCall: 'InCall',
    InWait: 'InWait',
    CallCancelByClient: 'CallCancelByClient',
    DroppedByClient: 'DroppedByClient',
    DroppedByTranslator: 'DroppedByTranslator',
});

const QueueStatus = Object.freeze({
    Pending: 'Pending',
    Accept: 'Accept',
    Cancel: 'Cancel',
});

module.exports = { CallStatus, QueueStatus };
