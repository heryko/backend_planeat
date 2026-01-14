-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: plan_eat
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

-- SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'a2f3b464-c2da-11f0-b0f3-bcfce753d07e:1-181';

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `fk_favorites-users_idx` (`user_id`),
  KEY `fk_favorites-recipes_idx` (`recipe_id`),
  CONSTRAINT `fk_favorites-recipes` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `fk_favorites-users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,102),(2,102);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fridge`
--

DROP TABLE IF EXISTS `fridge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fridge` (
  `fridge_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`fridge_id`),
  KEY `user_id` (`user_id`),
  KEY `ingredients_foreign_key_idx` (`ingredient_id`),
  CONSTRAINT `fk_fridge-igredients` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fridge`
--

LOCK TABLES `fridge` WRITE;
/*!40000 ALTER TABLE `fridge` DISABLE KEYS */;
INSERT INTO `fridge` VALUES (1,1,1,5.00,'2025-12-25','2025-12-16 15:58:50'),(2,1,5,2.00,'2025-12-28','2025-12-16 15:58:56'),(3,1,5,2.00,'2025-12-28','2025-12-16 15:59:18'),(4,1,12,1.00,'2025-12-30','2025-12-16 15:59:20'),(5,2,3,4.00,'2025-12-26','2025-12-16 15:59:23'),(6,2,7,2.00,'2025-12-29','2025-12-16 15:59:28'),(7,2,15,6.00,'2025-12-31','2025-12-16 15:59:32'),(8,1,2,0.00,'2025-12-31','2025-12-16 15:59:32');
/*!40000 ALTER TABLE `fridge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `ingredient_id` int NOT NULL DEFAULT '1',
  `name` varchar(100) NOT NULL,
  `unit` enum('ml','g','pcs') NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE KEY `ingredient_id_UNIQUE` (`ingredient_id`),
  CONSTRAINT `fk_recipe_ingredients-recipes` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'Tomato','pcs',0),(2,'Cheese','g',0),(3,'Flour','g',0),(4,'Olive Oil','ml',0),(5,'Salt','g',0),(6,'Pepper','g',0),(7,'Basil','g',0),(8,'Onion','pcs',0),(9,'Garlic','pcs',0),(10,'Sugar','g',0),(11,'Butter','g',0),(12,'Milk','ml',0),(13,'Egg','pcs',0),(14,'Carrot','pcs',0),(15,'Potato','pcs',0),(16,'Chicken Breast','g',0),(17,'Beef','g',0),(18,'Pork','g',0),(19,'Fish','g',0),(20,'Rice','g',0),(21,'Pasta','g',0),(22,'Bread','pcs',0),(23,'Lettuce','g',0),(24,'Cucumber','pcs',0),(25,'Bell Pepper','pcs',0),(26,'Spinach','g',0),(27,'Mushroom','pcs',0),(28,'Corn','g',0),(29,'Peas','g',0),(30,'Tomato Paste','g',0),(31,'Yogurt','ml',0),(32,'Cream','ml',0),(33,'Mayonnaise','ml',0),(34,'Ketchup','ml',0),(35,'Mustard','ml',0),(36,'Vinegar','ml',0),(37,'Soy Sauce','ml',0),(38,'Honey','g',0),(39,'Lemon','pcs',0),(40,'Orange','pcs',0),(41,'Apple','pcs',0),(42,'Banana','pcs',0),(43,'Strawberry','g',0),(44,'Blueberry','g',0),(45,'Raspberry','g',0),(46,'Cabbage','g',0),(47,'Broccoli','g',0),(48,'Cauliflower','g',0),(49,'Zucchini','pcs',0),(50,'Eggplant','pcs',0),(51,'Chili Pepper','pcs',0),(52,'Ginger','g',0),(53,'Cinnamon','g',0),(54,'Nutmeg','g',0),(55,'Cloves','g',0),(56,'Paprika','g',0),(57,'Oregano','g',0),(58,'Thyme','g',0),(59,'Rosemary','g',0),(60,'Parsley','g',0),(61,'Coriander','g',0),(62,'Dill','g',0),(63,'Mint','g',0),(64,'Baking Powder','g',0),(65,'Vanilla Extract','ml',0),(66,'Cocoa Powder','g',0),(67,'Chocolate','g',0),(68,'Walnut','g',0),(69,'Almond','g',0),(70,'Hazelnut','g',0),(71,'Peanut','g',0),(72,'Sesame Seeds','g',0),(73,'Sunflower Seeds','g',0),(74,'Pumpkin Seeds','g',0),(75,'Oats','g',0),(76,'Cornmeal','g',0),(77,'Rice Flour','g',0),(78,'Soy Milk','ml',0),(79,'Coconut Milk','ml',0),(80,'Cheddar','g',0),(81,'Mozzarella','g',0),(82,'Parmesan','g',0),(83,'Feta','g',0),(84,'Cream Cheese','g',0),(85,'Bacon','g',0),(86,'Sausage','g',0),(87,'Ham','g',0),(88,'Shrimp','g',0),(89,'Tuna','g',0),(90,'Salmon','g',0),(91,'Cod','g',0),(92,'Mushroom Sauce','ml',0),(93,'Tomato Sauce','ml',0),(94,'Pesto','ml',0),(95,'Olives','pcs',0),(96,'Capers','g',0),(97,'Pickles','pcs',0),(98,'Rice Noodles','g',0),(99,'Soybeans','g',0),(100,'Lentils','g',0);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_plan_recipes`
--

DROP TABLE IF EXISTS `meal_plan_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_plan_recipes` (
  `mpr_id` int NOT NULL AUTO_INCREMENT,
  `plan_id` int DEFAULT NULL,
  `recipe_id` int DEFAULT NULL,
  `meal_time` int DEFAULT NULL,
  PRIMARY KEY (`mpr_id`),
  KEY `'fk_meal_plan_recipes-meal_plans_idx` (`plan_id`),
  KEY `fk_meal_plan_recipes-recipes_idx` (`recipe_id`),
  CONSTRAINT `'fk_meal_plan_recipes-meal_plans` FOREIGN KEY (`plan_id`) REFERENCES `meal_plans` (`plan_id`),
  CONSTRAINT `fk_meal_plan_recipes-recipes` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plan_recipes`
--

LOCK TABLES `meal_plan_recipes` WRITE;
/*!40000 ALTER TABLE `meal_plan_recipes` DISABLE KEYS */;
INSERT INTO `meal_plan_recipes` VALUES (2,1,102,30),(3,2,102,15),(10,7,102,98);
/*!40000 ALTER TABLE `meal_plan_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_plans`
--

DROP TABLE IF EXISTS `meal_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `plan_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `meal_plans_user_id_key_idx` (`user_id`),
  CONSTRAINT `fk_mea_plans-users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plans`
--

LOCK TABLES `meal_plans` WRITE;
/*!40000 ALTER TABLE `meal_plans` DISABLE KEYS */;
INSERT INTO `meal_plans` VALUES (1,1,'Plan obiadowy 1','2025-12-17','2025-12-16 16:46:01'),(2,2,'Plan obiadowy 2','2025-12-17','2025-12-16 16:46:08'),(7,1,'Plan na 16 grudnia','2025-12-16','2025-12-16 17:40:44');
/*!40000 ALTER TABLE `meal_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredients`
--

DROP TABLE IF EXISTS `recipe_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredients` (
  `recipe_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  KEY `igredients_foreign_key_idx` (`ingredient_id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `recipe_id_2` (`recipe_id`),
  CONSTRAINT `fk_recipe_ingredients-ingredients` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
INSERT INTO `recipe_ingredients` VALUES (102,1,5.00),(102,2,10.00);
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`recipe_id`),
  KEY `fk_recipes-users_idx` (`user_id`),
  CONSTRAINT `fk_recipes-users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (102,2,'Sałatka Grecka','Lunch','Świeża sałatka z serem feta','2025-12-16 15:38:10'),(104,2,'Kotlet','Lunch','mięcho','2025-12-17 14:22:51');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_items`
--

DROP TABLE IF EXISTS `shopping_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_items` (
  `si_id` int NOT NULL AUTO_INCREMENT,
  `list_id` int DEFAULT NULL,
  `ingredient_id` int DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`si_id`),
  KEY `fk_shopping_items-ingredients_idx` (`ingredient_id`),
  KEY `fk_shopping_items-shopping_list_idx` (`list_id`),
  CONSTRAINT `fk_shopping_items-ingredients` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `fk_shopping_items-shopping_list` FOREIGN KEY (`list_id`) REFERENCES `shopping_lists` (`list_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_items`
--

LOCK TABLES `shopping_items` WRITE;
/*!40000 ALTER TABLE `shopping_items` DISABLE KEYS */;
INSERT INTO `shopping_items` VALUES (1,1,1,3.00),(2,1,5,2.00),(3,2,3,4.00),(4,2,7,2.00),(5,3,1,200.00),(6,3,5,150.00),(7,3,5,3.00),(8,3,35,100.00),(9,3,21,2.00);
/*!40000 ALTER TABLE `shopping_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_lists`
--

DROP TABLE IF EXISTS `shopping_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_lists` (
  `list_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `plan_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`list_id`),
  KEY `fk_shopping_lists-users_idx` (`user_id`),
  KEY `'fk_shopping_lists-meal_plans_idx` (`plan_id`),
  CONSTRAINT `'fk_shopping_lists-meal_plans` FOREIGN KEY (`plan_id`) REFERENCES `meal_plans` (`plan_id`),
  CONSTRAINT `fk_shopping_lists-users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_lists`
--

LOCK TABLES `shopping_lists` WRITE;
/*!40000 ALTER TABLE `shopping_lists` DISABLE KEYS */;
INSERT INTO `shopping_lists` (`list_id`,`user_id`,`plan_id`,`name`,`created_at`) VALUES (1,1,1,'Lista do planu 1','2025-12-16 16:49:48'),(2,2,2,'Lista do planu 2','2025-12-16 16:49:55'),(3,1,7,'Lista do planu 7','2025-12-16 17:40:44');
/*!40000 ALTER TABLE `shopping_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Marek','Marek@gmail.com','123','user','2025-12-16 15:08:29'),(2,'Karol','karol@example.com','123','user','2025-12-16 15:08:29'),(4,'string','string@gmail.com','$2b$10$eYT09hCey6QlmWV.eZT0e.VZlGZ4MNeg1g1pUxfp1FvrkYKGaeJ3a','user','2025-12-17 13:33:48'),(5,'string','string@gmail.com','$2b$10$IbzDlikv.xHa3AO4Lgu4dOjKR1elYBzzmFHixmfJ0I4A7l73irf9e','user','2025-12-17 13:34:57'),(6,'string','string@gmail.com','$2b$10$JQAbZxV7Qd1s.jTUFOA8YOoVk8hvn.RxbK64N9z5so6lrkZHoTiAC','user','2025-12-17 13:38:00'),(7,'test','test@gmail.com','$2b$10$lbUPrFWZbUJapQ11B6RrC..bd2nzaOFC9.C2.C58sdCq6CUtK6SMS','user','2025-12-17 13:39:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 13:08:39
