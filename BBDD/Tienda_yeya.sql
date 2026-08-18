-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Tienda_yeya
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Tienda_yeya
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Tienda_yeya` DEFAULT CHARACTER SET utf8 ;
USE `Tienda_yeya` ;

-- -----------------------------------------------------
-- Table `Tienda_yeya`.`carrito_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`carrito_productos` (
  `id_carrito_productos` INT NOT NULL AUTO_INCREMENT,
  `cantidad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_carrito_productos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`carrito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`carrito` (
  `id_carrito` INT NOT NULL AUTO_INCREMENT,
  `fecha_creacion` DATETIME NOT NULL,
  `fecha_actualizacion` DATETIME NOT NULL,
  `carrito_productos_id_carrito_productos` INT NOT NULL,
  PRIMARY KEY (`id_carrito`, `carrito_productos_id_carrito_productos`),
  INDEX `fk_carrito_carrito_productos1_idx` (`carrito_productos_id_carrito_productos` ASC) VISIBLE,
  CONSTRAINT `fk_carrito_carrito_productos1`
    FOREIGN KEY (`carrito_productos_id_carrito_productos`)
    REFERENCES `Tienda_yeya`.`carrito_productos` (`id_carrito_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_completo` VARCHAR(100) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `fecha_registro` DATE NOT NULL,
  `rol` VARCHAR(45) NOT NULL,
  `carrito_id_carrito` INT NOT NULL,
  PRIMARY KEY (`id_usuario`, `carrito_id_carrito`),
  INDEX `fk_usuarios_carrito1_idx` (`carrito_id_carrito` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_carrito1`
    FOREIGN KEY (`carrito_id_carrito`)
    REFERENCES `Tienda_yeya`.`carrito` (`id_carrito`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`direcciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`direcciones` (
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
    REFERENCES `Tienda_yeya`.`usuarios` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`productos` (
  `id_productos` INT NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(10) NOT NULL,
  `nombre_producto` VARCHAR(45) NOT NULL,
  `descripcion_producto` VARCHAR(45) NOT NULL,
  `precio_producto` DECIMAL(4,2) NOT NULL,
  `stock` INT NOT NULL,
  `disponibilidad` VARCHAR(10) NOT NULL,
  `carrito_productos_id_carrito_productos` INT NOT NULL,
  PRIMARY KEY (`id_productos`, `carrito_productos_id_carrito_productos`),
  INDEX `fk_productos_carrito_productos1_idx` (`carrito_productos_id_carrito_productos` ASC) VISIBLE,
  CONSTRAINT `fk_productos_carrito_productos1`
    FOREIGN KEY (`carrito_productos_id_carrito_productos`)
    REFERENCES `Tienda_yeya`.`carrito_productos` (`id_carrito_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(45) NOT NULL,
  `slug` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`subcategoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`subcategoria` (
  `id_subcategoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_subcategoria` VARCHAR(45) NOT NULL,
  `categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`id_subcategoria`, `categorias_id_categoria`),
  INDEX `fk_subcategoria_categorias1_idx` (`categorias_id_categoria` ASC) VISIBLE,
  CONSTRAINT `fk_subcategoria_categorias1`
    FOREIGN KEY (`categorias_id_categoria`)
    REFERENCES `Tienda_yeya`.`categorias` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`imagenes_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`imagenes_productos` (
  `id_imagenes_productos` INT NOT NULL AUTO_INCREMENT,
  `url_imagen` VARCHAR(50) NOT NULL,
  `productos_id_productos` INT NOT NULL,
  PRIMARY KEY (`id_imagenes_productos`, `productos_id_productos`),
  INDEX `fk_imagenes_productos_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  CONSTRAINT `fk_imagenes_productos_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `Tienda_yeya`.`productos` (`id_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`variantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`variantes` (
  `id_variantes` INT NOT NULL AUTO_INCREMENT,
  `sku_variante` VARCHAR(45) NOT NULL,
  `atributos` VARCHAR(45) NOT NULL,
  `stock_variante` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_variantes`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`detalle_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`detalle_pedido` (
  `id_detalle_pedido` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `precio_total_unitario` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`id_detalle_pedido`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`pedidos` (
  `id_pedidos` INT NOT NULL AUTO_INCREMENT,
  `numero_pedido` INT NOT NULL,
  `total` DECIMAL(5,2) NOT NULL,
  `estado_pedido` VARCHAR(45) NOT NULL,
  `fecha_creacion_pedido` DATETIME NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  `usuarios_carrito_id_carrito` INT NOT NULL,
  `detalle_pedido_id_detalle_pedido` INT NOT NULL,
  PRIMARY KEY (`id_pedidos`, `usuarios_id_usuario`, `usuarios_carrito_id_carrito`, `detalle_pedido_id_detalle_pedido`),
  INDEX `fk_pedidos_usuarios1_idx` (`usuarios_id_usuario` ASC, `usuarios_carrito_id_carrito` ASC) VISIBLE,
  INDEX `fk_pedidos_detalle_pedido1_idx` (`detalle_pedido_id_detalle_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_pedidos_usuarios1`
    FOREIGN KEY (`usuarios_id_usuario` , `usuarios_carrito_id_carrito`)
    REFERENCES `Tienda_yeya`.`usuarios` (`id_usuario` , `carrito_id_carrito`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_detalle_pedido1`
    FOREIGN KEY (`detalle_pedido_id_detalle_pedido`)
    REFERENCES `Tienda_yeya`.`detalle_pedido` (`id_detalle_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`pagos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`pagos` (
  `id_pagos` INT NOT NULL AUTO_INCREMENT,
  `metodo_pago` VARCHAR(45) NOT NULL,
  `monto` DECIMAL(5,2) NOT NULL,
  `fecha_pago` DATETIME NOT NULL,
  `pedidos_id_pedidos` INT NOT NULL,
  `pedidos_usuarios_id_usuario` INT NOT NULL,
  `pedidos_usuarios_carrito_id_carrito` INT NOT NULL,
  `pedidos_detalle_pedido_id_detalle_pedido` INT NOT NULL,
  PRIMARY KEY (`id_pagos`, `pedidos_id_pedidos`, `pedidos_usuarios_id_usuario`, `pedidos_usuarios_carrito_id_carrito`, `pedidos_detalle_pedido_id_detalle_pedido`),
  INDEX `fk_pagos_pedidos1_idx` (`pedidos_id_pedidos` ASC, `pedidos_usuarios_id_usuario` ASC, `pedidos_usuarios_carrito_id_carrito` ASC, `pedidos_detalle_pedido_id_detalle_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_pagos_pedidos1`
    FOREIGN KEY (`pedidos_id_pedidos` , `pedidos_usuarios_id_usuario` , `pedidos_usuarios_carrito_id_carrito` , `pedidos_detalle_pedido_id_detalle_pedido`)
    REFERENCES `Tienda_yeya`.`pedidos` (`id_pedidos` , `usuarios_id_usuario` , `usuarios_carrito_id_carrito` , `detalle_pedido_id_detalle_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`envios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`envios` (
  `id_envios` INT NOT NULL AUTO_INCREMENT,
  `paqueteria` VARCHAR(45) NOT NULL,
  `numero_rastreo` VARCHAR(45) NOT NULL,
  `estado_envio` VARCHAR(45) NOT NULL,
  `fecha_despacho` DATETIME NOT NULL,
  `fecha_entrega_estimada` VARCHAR(45) NOT NULL,
  `pedidos_id_pedidos` INT NOT NULL,
  `pedidos_usuarios_id_usuario` INT NOT NULL,
  `pedidos_usuarios_carrito_id_carrito` INT NOT NULL,
  `pedidos_detalle_pedido_id_detalle_pedido` INT NOT NULL,
  PRIMARY KEY (`id_envios`, `pedidos_id_pedidos`, `pedidos_usuarios_id_usuario`, `pedidos_usuarios_carrito_id_carrito`, `pedidos_detalle_pedido_id_detalle_pedido`),
  INDEX `fk_envios_pedidos1_idx` (`pedidos_id_pedidos` ASC, `pedidos_usuarios_id_usuario` ASC, `pedidos_usuarios_carrito_id_carrito` ASC, `pedidos_detalle_pedido_id_detalle_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_envios_pedidos1`
    FOREIGN KEY (`pedidos_id_pedidos` , `pedidos_usuarios_id_usuario` , `pedidos_usuarios_carrito_id_carrito` , `pedidos_detalle_pedido_id_detalle_pedido`)
    REFERENCES `Tienda_yeya`.`pedidos` (`id_pedidos` , `usuarios_id_usuario` , `usuarios_carrito_id_carrito` , `detalle_pedido_id_detalle_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`productos_has_categorias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`productos_has_categorias` (
  `productos_id_productos` INT NOT NULL,
  `categorias_id_categoria` INT NOT NULL,
  PRIMARY KEY (`productos_id_productos`, `categorias_id_categoria`),
  INDEX `fk_productos_has_categorias_categorias1_idx` (`categorias_id_categoria` ASC) VISIBLE,
  INDEX `fk_productos_has_categorias_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  CONSTRAINT `fk_productos_has_categorias_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `Tienda_yeya`.`productos` (`id_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_productos_has_categorias_categorias1`
    FOREIGN KEY (`categorias_id_categoria`)
    REFERENCES `Tienda_yeya`.`categorias` (`id_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Tienda_yeya`.`variantes_has_productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tienda_yeya`.`variantes_has_productos` (
  `variantes_id_variantes` INT NOT NULL,
  `productos_id_productos` INT NOT NULL,
  PRIMARY KEY (`variantes_id_variantes`, `productos_id_productos`),
  INDEX `fk_variantes_has_productos_productos1_idx` (`productos_id_productos` ASC) VISIBLE,
  INDEX `fk_variantes_has_productos_variantes1_idx` (`variantes_id_variantes` ASC) VISIBLE,
  CONSTRAINT `fk_variantes_has_productos_variantes1`
    FOREIGN KEY (`variantes_id_variantes`)
    REFERENCES `Tienda_yeya`.`variantes` (`id_variantes`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_variantes_has_productos_productos1`
    FOREIGN KEY (`productos_id_productos`)
    REFERENCES `Tienda_yeya`.`productos` (`id_productos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
