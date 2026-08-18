USE la_yeya;

SHOW TABLES;

-- Insertar datos a la tabla usuarios
DESCRIBE usuarios;
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO usuarios (nombre_completo, email, telefono, password, fecha_registro, rol,carrito_id_carrito)
VALUES
('Carlos Alberto Romero', 'cromero@empresa.com', '8112345678', 'AdminSecure24!', '2026-01-15', 'admin',1),
('Valeria Garza Treviño', 'vgarza@empresa.com', '5559876543', 'Val_Admin#99', '2026-02-20', 'admin',2),
('Roberto Martínez', 'rmartinez@correo.com', '3334567890', 'UserPass01$', '2026-03-10', 'user',3),
('María Fernanda López', 'mflopez@correo.com', '8187654321', 'MariaF2026*', '2026-04-05', 'user',4),
('Javier Hernández', 'jhernandez@correo.com', '5511223344', 'Jav1er_User', '2026-05-12', 'user',5);

-- Insertar datos a la tabla direcciones
INSERT INTO direcciones (id_direccion, calle, numero, colonia, ciudad, estado, codigo_postal, usuarios_id_usuario) 
VALUES
(1, 'Av. Paseo de los Leones', '1500', 'Cumbres 1er Sector', 'Monterrey', 'Nuevo León', '64610', 1),
(2, 'Av. Universidad', '101', 'Universidad', 'San Nicolás', 'Nuevo León', '66455', 2),
(3, 'Ruiz Cortines', '3452', 'Mitras Centro', 'Monterrey', 'Nuevo León', '64460', 3),
(4, 'Calle Morelos', '120-B', 'Centro', 'Monterrey', 'Nuevo León', '64000', 4),
(5, 'Blvd. Antonio L. Rdz.', '405', 'San Jerónimo', 'Monterrey', 'Nuevo León', '64640', 5);

-- Insertar datos a la tabla productos
INSERT INTO productos (id_productos, sku, nombre_producto, descripcion_producto, precio_producto, stock, disponibilidad, carrito_productos_id_carrito_productos) 
VALUES
(1, 'COL-BOF-01', 'Boys Over Flowers', 'Collar de estrella del Kdrama Boys Over Flowers', 120.00, 2, 'disponible', 1),
(2, 'ARE-JAK-01', 'Aretes Jake hora de aventura', 'Aretes tamaño grande de acrilico Jake', 120.00, 1, 'disponible', 1),
(3, 'COL-ONP-01', 'One Piece doble dije', 'Collar largo con doble dije de One Piece', 180.00, 2, 'disponible', 2),
(4, 'ARE-VAQ-01', 'Aretes vaqueros', 'Aretes de corazon y botas baqueras tamaño mediano', 110.00, 1, 'disponible', 3),
(5, 'ANI-MIR-01', 'Miraculous Chat Noir', 'Anillo Miraculous de Adrien Agreste/ Chat Noir color negro', 60.00, 4, 'disponible', 4);

-- Insertar datos a la tabla categorias
INSERT INTO categorias (id_categoria, nombre_categoria, slug) 
VALUES
(1, 'Joyeria', 'joyeria'),
(2, 'Accesorios', 'accesorios'),
(3, 'Complementos', 'complementos'),
(4, 'Cuidado', 'cuidado'),
(5, 'General', 'general');

-- Insertar datos a la tabla subcategoria
INSERT INTO subcategoria (id_subcategoria, nombre_subcategoria, categorias_id_categoria) 
VALUES
(1, 'anillos', 1),
(2, 'aretes', 1),
(3, 'collar', 1),
(4, 'diadema', 2),
(5, 'lentes', 2);

-- Insertar datos a la tabla variantes
INSERT INTO variantes (id_variantes, sku_variante, atributos, stock_variante) 
VALUES
(1, 'VAR-COL-01', 'Dorado', '15'),
(2, 'VAR-COL-02', 'Plateado', '20'),
(3, 'VAR-COL-03', 'Rosa', '5'),
(4, 'VAR-COL-04', 'Negro', '8'),
(5, 'VAR-COL-05', 'Amarillo', '12'),
(6, 'VAR-MAT-01', 'Fantasia', '30'),
(7, 'VAR-MAT-02', 'Acrilico', '10'),
(8, 'VAR-MAT-03', 'Acero inoxidable', '25'),
(9, 'VAR-MAT-04', 'Acero inoxidable', '18'),
(10, 'VAR-MAT-05', 'Plata', '7');

-- Insertar datos a la tabla imagenes_productos
INSERT INTO imagenes_productos (id_imagenes_productos, url_imagen, productos_id_productos) 
VALUES
(1, '/img/productos/collar-bof.jpg', 1),
(2, '/img/productos/aretes-jake.jpg', 2),
(3, '/img/productos/collar-onepiece.jpg', 3),
(4, '/img/productos/aretes-vaqueros.jpg', 4),
(5, '/img/productos/anillo-miraculous.jpg', 5);

-- Insertar datos en la tabla variantes_has_productos
INSERT INTO variantes_has_productos (variantes_id_variantes, productos_id_productos) 
VALUES
(2, 1),
(8, 1),
(5, 2),
(7, 2),
(1, 3),
(6, 3),
(3, 4),
(9, 4),
(4, 5),
(10, 5);

-- Insertar datos en la tabla productos_has_categorias
INSERT INTO productos_has_categorias (productos_id_productos, categorias_id_categoria) 
VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(4, 2),
(5, 1);

-- Insertar datos en la tabla carrito
INSERT INTO carrito (id_carrito, fecha_creacion, fecha_actualizacion, carrito_productos_id_carrito_productos) 
VALUES
(1, '2026-06-01 10:30:00', '2026-06-01 10:30:00', 1),
(2, '2026-06-05 14:15:00', '2026-06-06 09:20:00', 2),
(3, '2026-06-10 16:45:00', '2026-06-10 16:45:00', 3),
(4, '2026-06-12 11:00:00', '2026-06-13 12:10:00', 4),
(5, '2026-06-15 08:20:00', '2026-06-15 08:20:00', 5);

-- Insertar datos en la tabla carrito_productos
INSERT INTO carrito_productos (id_carrito_productos, cantidad) VALUES
(1, '2'),
(2, '1'),
(3, '4'),
(4, '1'),
(5, '3');

-- Insertar datos en la tabla pagos
INSERT INTO pagos (id_pagos, metodo_pago, monto, fecha_pago, pedidos_id_pedidos, pedidos_usuarios_id_usuario, pedidos_usuarios_carrito_id_carrito, pedidos_detalle_pedido_id_detalle_pedido) 
VALUES
(1, 'Tarjeta de Crédito', 240.00, '2026-06-02 12:05:00', 1, 1, 1, 1),
(2, 'PayPal', 120.00, '2026-06-06 10:05:00', 2, 2, 2, 2),
(3, 'Transferencia', 720.00, '2026-06-11 09:35:00', 3, 3, 3, 3),
(4, 'Tarjeta de Débito', 110.00, '2026-06-13 14:05:00', 4, 4, 4, 4),
(5, 'OXXO', 180.00, '2026-06-16 12:00:00', 5, 5, 5, 5);

-- Insertar datos en la tabla pedidos
INSERT INTO pedidos (id_pedidos, numero_pedido, total, estado_pedido, fecha_creacion_pedido, usuarios_id_usuario, usuarios_carrito_id_carrito, detalle_pedido_id_detalle_pedido) 
VALUES
(1, 1001, 240.00, 'Procesando', '2026-06-02 12:00:00', 1, 1, 1),
(2, 1002, 120.00, 'Pagado', '2026-06-06 10:00:00', 2, 2, 2),
(3, 1003, 720.00, 'Enviado', '2026-06-11 09:30:00', 3, 3, 3),
(4, 1004, 110.00, 'Entregado', '2026-06-13 14:00:00', 4, 4, 4),
(5, 1005, 180.00, 'Pendiente', '2026-06-16 11:15:00', 5, 5, 5);

-- Insertar datos en la tabla detalle_pedido
INSERT INTO detalle_pedido (id_detalle_pedido, cantidad, precio_total_unitario) 
VALUES
(1, 2, 240.00),
(2, 1, 120.00),
(3, 4, 720.00),
(4, 1, 110.00),
(5, 3, 180.00);


-- Insertar datos en la tabla pedidos
INSERT INTO envios (id_envios, paqueteria, numero_rastreo, estado_envio, fecha_despacho, fecha_entrega_estimada, pedidos_id_pedidos, pedidos_usuarios_id_usuario, pedidos_usuarios_carrito_id_carrito, pedidos_detalle_pedido_id_detalle_pedido) 
VALUES
(1, 'FedEx', 'FDX-12345', 'En tránsito', '2026-06-03 09:00:00', '05/06/2026', 1, 1, 1, 1),
(2, 'DHL', 'DHL-98765', 'Preparando', '2026-06-07 10:00:00', '10/06/2026', 2, 2, 2, 2),
(3, 'Estafeta', 'EST-44556', 'Entregado', '2026-06-12 08:30:00', '14/06/2026', 3, 3, 3, 3),
(4, 'Mercado Envíos', 'MEL-99887', 'Entregado', '2026-06-14 11:00:00', '16/06/2026', 4, 4, 4, 4),
(5, 'Redpack', 'RDP-11223', 'Pendiente', '2026-06-17 09:00:00', '20/06/2026', 5, 5, 5, 5);


SET FOREIGN_KEY_CHECKS = 1;












