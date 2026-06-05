CREATE TABLE `artistas` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`slug` varchar(255) NOT NULL,
	`nombreArtistico` varchar(255) NOT NULL,
	`bio` text,
	`fotoPrincipal` varchar(512),
	`fotosExtra` json,
	`enlacesVideo` json,
	`redesSociales` json,
	`planStatus` enum('free','estandar','premium') NOT NULL DEFAULT 'free',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`visitas` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artistas_id` PRIMARY KEY(`id`),
	CONSTRAINT `artistas_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE `eventos` (
	`id` varchar(36) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descripcion` text,
	`fecha` timestamp NOT NULL,
	`ubicacion` varchar(255) NOT NULL,
	`latitud` decimal(10,8),
	`longitud` decimal(11,8),
	`fotoPrincipal` varchar(512),
	`enlaceExterno` varchar(512),
	`disciplinas` json,
	`status` enum('pending_moderation','approved','rejected','cancelled') NOT NULL DEFAULT 'pending_moderation',
	`tokenAnonimo` varchar(255),
	`usuarioId` int,
	`artistaId` varchar(36),
	`visitas` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `eventos_id` PRIMARY KEY(`id`)
);

CREATE TABLE `suscripciones` (
	`id` varchar(36) NOT NULL,
	`artistaId` varchar(36) NOT NULL,
	`planAnterior` enum('free','estandar','premium'),
	`planNuevo` enum('free','estandar','premium') NOT NULL,
	`stripeEventId` varchar(255),
	`razon` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `suscripciones_id` PRIMARY KEY(`id`)
);
