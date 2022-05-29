const RolesList = {
    [process.env.ADMIN_USER_TYPE_SLUG]: process.env.ADMIN_ROLE,
    [process.env.EXAMINER_USER_TYPE_SLUG]: process.env.EXAMINER_ROLE,
    [process.env.DOCTOR_USER_TYPE_SLUG]: process.env.DOCTOR_ROLE,
}

module.exports = RolesList;