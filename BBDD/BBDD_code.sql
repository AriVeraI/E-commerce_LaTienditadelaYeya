-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema la_yeya
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `la_yeya` ;

-- -----------------------------------------------------
-- Schema la_yeya
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `la_yeya` DEFAULT CHARACTER SET utf8mb3 ;
USE `la_yeya` ;

-- -----------------------------------------------------
-- Table `la_yeya`.`roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`roles` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`roles` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `rol_usuario` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_rol`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_completo` VARCHAR(100) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `fecha_registro` DATE NOT NULL,
  `roles_id_rol` INT NOT NULL,
  PRIMARY KEY (`id_usuario`, `roles_id_rol`),
  INDEX `fk_usuarios_roles1_idx` (`roles_id_rol` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_roles1`
    FOREIGN KEY (`roles_id_rol`)
    REFERENCES `la_yeya`.`roles` (`id_rol`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`carrito`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`carrito` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`carrito` (
  `id_carrito` INT NOT NULL AUTO_INCREMENT,
  `fecha_creacion` DATETIME NOT NULL,
  `fecha_actualizacion` DATETIME NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_carrito`, `usuarios_id_usuario`),
  INDEX `fk_carrito_usuarios1_idx` (`usuarios_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_carrito_usuarios1`
    FOREIGN KEY (`usuarios_id_usuario`)
    REFERENCES `la_yeya`.`usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`productos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`productos` (
  `id_productos` INT NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(10) NOT NULL,
  `nombre_producto` VARCHAR(45) NOT NULL,
  `descripcion_producto` VARCHAR(150) NOT NULL,
  `precio_producto` DECIMAL(5,2) NOT NULL,
  `stock` INT NOT NULL,
  `disponibilidad` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id_productos`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`carrito_productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`carrito_productos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`carrito_productos` (
  `id_carrito_productos` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `productos_id_productos` INT NOT NULL,
  `carrito_id_carrito` INT NOT NULL,
  PRIMARY KEY (`id_carrito_productos`, `productos_id_productos`, `carrito_id_carrito`),
  INDEX `fk_carrito_productos_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  INDEX `fk_carrito_productos_carrito1_idx` (`carrito_id_carrito` ASC) VISIBLE,
  CONSTRAINT `fk_carrito_productos_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `la_yeya`.`productos` (`id_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_carrito_productos_carrito1`
    FOREIGN KEY (`carrito_id_carrito`)
    REFERENCES `la_yeya`.`carrito` (`id_carrito`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`categorias` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(45) NOT NULL,
  `slug` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`pedidos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`pedidos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`pedidos` (
  `id_pedidos` INT NOT NULL AUTO_INCREMENT,
  `numero_pedido` INT NOT NULL,
  `total` DECIMAL(5,2) NOT NULL,
  `estado_pedido` VARCHAR(45) NOT NULL,
  `fecha_creacion_pedido` DATETIME NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_pedidos`, `usuarios_id_usuario`),
  INDEX `fk_pedidos_usuarios1_idx` (`usuarios_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_usuarios1`
    FOREIGN KEY (`usuarios_id_usuario`)
    REFERENCES `la_yeya`.`usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`detalle_pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`detalle_pedido` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`detalle_pedido` (
  `id_detalle_pedido` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `precio_total_unitario` DECIMAL(5,2) NOT NULL,
  `pedidos_id_pedidos` INT NOT NULL,
  `productos_id_productos` INT NOT NULL,
  PRIMARY KEY (`id_detalle_pedido`, `pedidos_id_pedidos`, `productos_id_productos`),
  INDEX `fk_detalle_pedido_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  INDEX `fk_detalle_pedido_pedidos1_idx` (`pedidos_id_pedidos` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `la_yeya`.`productos` (`id_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_pedido_pedidos1`
    FOREIGN KEY (`pedidos_id_pedidos`)
    REFERENCES `la_yeya`.`pedidos` (`id_pedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`direcciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`direcciones` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`direcciones` (
  `id_direccion` INT NOT NULL AUTO_INCREMENT,
  `calle` VARCHAR(45) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `colonia` VARCHAR(45) NOT NULL,
  `ciudad` VARCHAR(25) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `codigo_postal` VARCHAR(45) NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_direccion`, `usuarios_id_usuario`),
  INDEX `fk_direcciones_usuarios_idx` (`usuarios_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_direcciones_usuarios`
    FOREIGN KEY (`usuarios_id_usuario`)
    REFERENCES `la_yeya`.`usuarios` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`envios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`envios` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`envios` (
  `id_envios` INT NOT NULL AUTO_INCREMENT,
  `paqueteria` VARCHAR(45) NOT NULL,
  `numero_rastreo` VARCHAR(45) NOT NULL,
  `estado_envio` VARCHAR(45) NOT NULL,
  `fecha_despacho` DATETIME NOT NULL,
  `fecha_entrega_estimada` VARCHAR(45) NOT NULL,
  `pedidos_id_pedidos` INT NOT NULL,
  PRIMARY KEY (`id_envios`, `pedidos_id_pedidos`),
  INDEX `fk_envios_pedidos1_idx` (`pedidos_id_pedidos` ASC) VISIBLE,
  CONSTRAINT `fk_envios_pedidos1`
    FOREIGN KEY (`pedidos_id_pedidos`)
    REFERENCES `la_yeya`.`pedidos` (`id_pedidos`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`imagenes_productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`imagenes_productos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`imagenes_productos` (
  `id_imagenes_productos` INT NOT NULL AUTO_INCREMENT,
  `url_imagen` VARCHAR(50) NOT NULL,
  `productos_id_productos` INT NOT NULL,
  PRIMARY KEY (`id_imagenes_productos`, `productos_id_productos`),
  INDEX `fk_imagenes_productos_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  CONSTRAINT `fk_imagenes_productos_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `la_yeya`.`productos` (`id_productos`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`pagos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`pagos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`pagos` (
  `id_pagos` INT NOT NULL AUTO_INCREMENT,
  `metodo_pago` VARCHAR(45) NOT NULL,
  `monto` DECIMAL(5,2) NOT NULL,
  `fecha_pago` DATETIME NOT NULL,
  `pedidos_id_pedidos` INT NOT NULL,
  PRIMARY KEY (`id_pagos`, `pedidos_id_pedidos`),
  INDEX `fk_pagos_pedidos1_idx` (`pedidos_id_pedidos` ASC) VISIBLE,
  CONSTRAINT `fk_pagos_pedidos1`
    FOREIGN KEY (`pedidos_id_pedidos`)
    REFERENCES `la_yeya`.`pedidos` (`id_pedidos`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`productos_has_categorias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`productos_has_categorias` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`productos_has_categorias` (
  `productos_id_productos` INT NOT NULL,
  `categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`productos_id_productos`, `categorias_id_categoria`),
  INDEX `fk_productos_has_categorias_categorias1_idx` (`categorias_id_categoria` ASC) VISIBLE,
  INDEX `fk_productos_has_categorias_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  CONSTRAINT `fk_productos_has_categorias_categorias1`
    FOREIGN KEY (`categorias_id_categoria`)
    REFERENCES `la_yeya`.`categorias` (`id_categoria`),
  CONSTRAINT `fk_productos_has_categorias_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `la_yeya`.`productos` (`id_productos`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`subcategoria`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`subcategoria` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`subcategoria` (
  `id_subcategoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_subcategoria` VARCHAR(45) NOT NULL,
  `categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_subcategoria`, `categorias_id_categoria`),
  INDEX `fk_subcategoria_categorias1_idx` (`categorias_id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_subcategoria_categorias1`
    FOREIGN KEY (`categorias_id_categoria`)
    REFERENCES `la_yeya`.`categorias` (`id_categoria`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`variantes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`variantes` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`variantes` (
  `id_variantes` INT NOT NULL AUTO_INCREMENT,
  `sku_variante` VARCHAR(45) NOT NULL,
  `atributos` VARCHAR(45) NOT NULL,
  `stock_variante` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_variantes`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `la_yeya`.`variantes_has_productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `la_yeya`.`variantes_has_productos` ;

CREATE TABLE IF NOT EXISTS `la_yeya`.`variantes_has_productos` (
  `variantes_id_variantes` INT NOT NULL,
  `productos_id_productos` INT NOT NULL,
  PRIMARY KEY (`variantes_id_variantes`, `productos_id_productos`),
  INDEX `fk_variantes_has_productos_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  INDEX `fk_variantes_has_productos_variantes1_idx` (`variantes_id_variantes` ASC) VISIBLE,
  CONSTRAINT `fk_variantes_has_productos_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `la_yeya`.`productos` (`id_productos`),
  CONSTRAINT `fk_variantes_has_productos_variantes1`
    FOREIGN KEY (`variantes_id_variantes`)
    REFERENCES `la_yeya`.`variantes` (`id_variantes`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
