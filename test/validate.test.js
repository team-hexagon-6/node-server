const validate = require('../utils/validation');

describe('login validation', () => {
    it('empty', () => {
        const validation = validate.login_validation({
            user_id: '',
            password: ''
        });

        expect(validation.error.details[0].message).toBe("\"user_id\" is not allowed to be empty");
        expect(validation.error.details[1].message).toBe("\"password\" is not allowed to be empty");
    })

    it('invalid', () => {
        const validation = validate.login_validation({
            user_id: '234',
            password: 'password1A'
        });

        expect(validation.error.details[0].message).toBe("\"user_id\" length must be at least 5 characters long");
        expect(validation.error.details[1].message).toBe("\"password\" with value \"password1A\" fails to match the required pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/");
    })

    it('valid', () => {
        const validation = validate.login_validation({
            user_id: '23443434A',
            password: 'password1A@'
        });

        expect(validation.error).toEqual(undefined);
        expect(validation.error).toEqual(undefined);
    })
})

describe('register validation', () => {
    it('empty', () => {
        const validation = validate.register_vaidation({
            user_id: '',
            password: '',
            user_type: '',
        });

        expect(validation.error.details[0].message).toBe("\"user_id\" is not allowed to be empty");
        expect(validation.error.details[1].message).toBe("\"password\" is not allowed to be empty");
        expect(validation.error.details[2].message).toBe("\"user_type\" is not allowed to be empty");

    })

    it('invalid', () => {
        const validation = validate.register_vaidation({
            user_id: '23',
            password: 'password1A',
            user_type: 'ssdfsdfsdfsdfsdf',
        });

        expect(validation.error.details[0].message).toBe("\"user_id\" length must be at least 5 characters long");
        expect(validation.error.details[1].message).toBe("\"password\" with value \"password1A\" fails to match the required pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/");
        expect(validation.error.details[2].message).toBe("\"user_type\" length must be less than or equal to 10 characters long");
    });

    it('valid', () => {
        const validation = validate.register_vaidation({
            user_id: '23sfsdfsdfA',
            password: 'password1A@',
            user_type: 'sdfsdfsd',
        });

        expect(validation.error).toBe(undefined);
        expect(validation.error).toBe(undefined);
        expect(validation.error).toBe(undefined);
    });

});