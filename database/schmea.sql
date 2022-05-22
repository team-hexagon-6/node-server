-- se.user_type definition
CREATE TABLE `user_type` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.`user` definition
CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nic` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `contact_no` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `birthday` date NOT NULL,
    `user_type_id` int NOT NULL,
    `active` tinyint(1) DEFAULT '1',
    `created_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_type_id` (`user_type_id`),
    CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.auth definition
CREATE TABLE `auth` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `logged_at` datetime DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.gender_type definition
CREATE TABLE `gender_type` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- se.patient definition
CREATE TABLE `patient` (
    `id` int NOT NULL AUTO_INCREMENT,
    `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nic` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `contact_no` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `birthday` date NOT NULL,
    `gender_type_id` int NOT NULL,
    `active` tinyint(1) DEFAULT '1',
    `created_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `user_type_id` (`user_type_id`),
    CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

