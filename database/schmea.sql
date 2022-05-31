-- se.testresult definition
CREATE TABLE `testresult` (
    `id` int NOT NULL,
    `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `testResult_name` (`name`),
    UNIQUE KEY `testResult_slug_key` (`slug`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.gendertype definition
CREATE TABLE `gendertype` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `gender_type_slug_key` (`slug`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.testtype definition
CREATE TABLE `testtype` (
    `id` int NOT NULL,
    `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `testType_slug_key` (`slug`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.usertype definition
CREATE TABLE `usertype` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `slug` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `userType_slug_key` (`slug`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.auth definition
CREATE TABLE `auth` (
    `id` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `logged_at` datetime DEFAULT NULL,
    `user_type_id` int NOT NULL,
    `active` tinyint(1) DEFAULT '1',
    `refresh_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `complete_profile` tinyint(1) DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `Auth_refresh_token_key` (`refresh_token`),
    KEY `user_type_id` (`user_type_id`),
    CONSTRAINT `auth_ibfk_2` FOREIGN KEY (`user_type_id`) REFERENCES `usertype` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.`user` definition
CREATE TABLE `user` (
    `user_id` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
    `firstname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `nic` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `contact_no` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `birthday` date DEFAULT NULL,
    `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`user_id`),
    CONSTRAINT `user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.patient definition
CREATE TABLE `patient` (
    `id` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
    `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nic` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `contact_no` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `birthday` date NOT NULL,
    `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    `gender_type_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `patient_ibfk_2` (`gender_type_id`),
    CONSTRAINT `patient_ibfk_2` FOREIGN KEY (`gender_type_id`) REFERENCES `gendertype` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.test definition
CREATE TABLE `test` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
    `confirmed` tinyint(1) NOT NULL DEFAULT '0',
    `patient_id` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    KEY `test_ibfk_23` (`patient_id`),
    CONSTRAINT `test_ibfk_23` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.testrecord definition
CREATE TABLE `testrecord` (
    `id` int NOT NULL AUTO_INCREMENT,
    `test_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `examiner_id` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
    `test_result_id` int NOT NULL,
    `test_type_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `test_ibfk_1` (`test_id`),
    KEY `test_ibfk_2` (`examiner_id`),
    KEY `test_ibfk_3` (`test_type_id`),
    KEY `test_record_ibfk_1` (`test_result_id`),
    CONSTRAINT `test_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON DELETE CASCADE,
    CONSTRAINT `test_ibfk_2` FOREIGN KEY (`examiner_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `test_ibfk_3` FOREIGN KEY (`test_type_id`) REFERENCES `testtype` (`id`) ON DELETE CASCADE,
    CONSTRAINT `test_record_ibfk_1` FOREIGN KEY (`test_result_id`) REFERENCES `testresult` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;