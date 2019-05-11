import { expect } from 'chai';
import { Message } from 'telegram-typings';
import ActiveSession, { SessionAction } from '../src/modules/activeSession';

const dummyMessage: Message = {
    message_id: 1234,
    date: 5678,
    chat: {
        id: 2345,
        type: 'private',
    },
};

describe('Active session tests', function() {
    it('can create an active session that ends automatically after a specific timeout', function(done) {
        ActiveSession.startSession(SessionAction.AddAdmin, 1234, dummyMessage, {
            timeout: 1000,
        });
        expect(ActiveSession.getSession(1234)).to.not.equal(undefined);
        expect(ActiveSession.getSession(1234).action).to.equal(
            SessionAction.AddAdmin,
        );
        expect(ActiveSession.getSession(1234).message).to.eql(dummyMessage);
        setTimeout(() => {
            expect(ActiveSession.getSession(1234)).to.equal(undefined);
            done();
        }, 1500);
    });
});
