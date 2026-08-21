USE la_yeya;

SHOW TABLES;
-- PRIMERO SE LLENAN LO DATOS DE LAS TABLAS SIN DEPENDENCIAS
-- Insertar datos a la tabla roles
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO roles (rol_usuario) 
VALUES
('admin'),
('user');
SELECT * FROM roles;

-- Insertar datos a la tabla categorias
DESCRIBE categorias;

INSERT INTO categorias (nombre_categoria, slug) 
VALUES
('Joyeria', 'joyeria'),
('Accesorios', 'accesorios'),
('Complementos', 'complementos'),
('Cuidado', 'cuidado'),
('General', 'general');
SELECT * FROM categorias;

-- Insertar datos a la tabla variantes
DESCRIBE variantes;

INSERT INTO variantes (sku_variante, atributos, stock_variante) 
VALUES
('VAR-COL-01', 'Dorado', '15'),
('VAR-COL-02', 'Plateado', '20'),
('VAR-COL-03', 'Rosa', '5'),
('VAR-COL-04', 'Negro', '8'),
('VAR-COL-05', 'Amarillo', '12'),
('VAR-MAT-01', 'Fantasia', '30'),
('VAR-MAT-02', 'Acrilico', '10'),
('VAR-MAT-03', 'Acero inoxidable', '25'),
('VAR-MAT-04', 'Acero inoxidable', '18'),
('VAR-MAT-05', 'Plata', '7');
SELECT * FROM variantes;

-- Insertar datos a la tabla productos
DESCRIBE productos;

INSERT INTO productos (sku, nombre_producto, descripcion_producto, precio_producto, stock, disponibilidad) 
VALUES
('COL-BOF-01', 'Boys Over Flowers', 'Collar de estrella del Kdrama Boys Over Flowers', 120.00, 2, 'disponible'),
('ARE-JAK-01', 'Aretes Jake hora de aventura', 'Aretes tamaño grande de acrilico Jake', 120.00, 1, 'disponible'),
('COL-ONP-01', 'One Piece doble dije', 'Collar largo con doble dije de One Piece', 180.00, 2, 'disponible'),
('ARE-VAQ-01', 'Aretes vaqueros', 'Aretes de corazon y botas baqueras tamaño mediano', 110.00, 1, 'disponible'),
('ANI-MIR-01', 'Miraculous Chat Noir', 'Anillo Miraculous de Adrien Agreste/ Chat Noir color negro', 60.00, 4, 'disponible');
SELECT * FROM productos;

-- PRIMERO SE LLENAN LO DATOS DE LAS TABLAS CON DEPENDENCIAS DE PRIMER NIVEL

-- Insertar datos a la tabla usuarios
DESCRIBE usuarios;

INSERT INTO usuarios (nombre_completo, email, telefono, password, fecha_registro, roles_id_rol)
VALUES 
('Carlos Alberto Romero', 'cromero@empresa.com', '8112345678', 'AdminSecure24!', '2026-01-15', 1),
('Valeria Garza Treviño', 'vgarza@empresa.com', '5559876543', 'Val_Admin#99', '2026-02-20', 1),
('Roberto Martínez', 'rmartinez@correo.com', '3334567890', 'UserPass01$', '2026-03-10', 2),
('María Fernanda López', 'mflopez@correo.com', '8187654321', 'MariaF2026*', '2026-04-05', 2),
('Javier Hernández', 'jhernandez@correo.com', '5511223344', 'Jav1er_User', '2026-05-12', 2);
SELECT * FROM usuarios;

-- Insertar datos a la tabla subcategoria
DESCRIBE subcategoria;

INSERT INTO subcategoria (nombre_subcategoria, categorias_id_categoria) 
VALUES
('anillos', 1),
('aretes', 1),
('collar', 1),
('diadema', 2),
('lentes', 2);
SELECT * FROM subcategoria;

-- Insertar datos a la tabla imagenes_productos
DESCRIBE imagenes_productos;

INSERT INTO imagenes_productos (url_imagen, productos_id_productos) 
VALUES
('/img/productos/collar-bof.jpg', 1),
('/img/productos/aretes-jake.jpg', 2),
('/img/productos/collar-onepiece.jpg', 3),
('/img/productos/aretes-vaqueros.jpg', 4),
('/img/productos/anillo-miraculous.jpg', 5);
SELECT * FROM imagenes_productos;


-- TABLAS INTERMEDIAS 

-- Insertar datos en la tabla productos_has_categorias
DESCRIBE imagenes_productos;

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
SELECT * FROM productos_has_categorias;

-- Insertar datos en la tabla variantes_has_productos
DESCRIBE variantes_has_productos;

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
SELECT * FROM variantes_has_productos;

-- Insertar datos a la tabla direcciones
DESCRIBE direcciones;

INSERT INTO direcciones (calle, numero, colonia, ciudad, estado, codigo_postal, usuarios_id_usuario) 
VALUES
('Av. Paseo de los Leones', '1500', 'Cumbres 1er Sector', 'Monterrey', 'Nuevo León', '64610', 1),
('Av. Universidad', '101', 'Universidad', 'San Nicolás', 'Nuevo León', '66455', 2),
('Ruiz Cortines', '3452', 'Mitras Centro', 'Monterrey', 'Nuevo León', '64460', 3),
('Calle Morelos', '120-B', 'Centro', 'Monterrey', 'Nuevo León', '64000', 4),
('Blvd. Antonio L. Rdz.', '405', 'San Jerónimo', 'Monterrey', 'Nuevo León', '64640', 5);
SELECT * FROM direcciones;

-- Insertar datos en la tabla carrito
DESCRIBE carrito;

INSERT INTO carrito (fecha_creacion, fecha_actualizacion, usuarios_id_usuario) 
VALUES
('2026-06-01 10:30:00', '2026-06-01 10:30:00', 1),
('2026-06-05 14:15:00', '2026-06-06 09:20:00', 2),
('2026-06-10 16:45:00', '2026-06-10 16:45:00', 3),
('2026-06-12 11:00:00', '2026-06-13 12:10:00', 4),
('2026-06-15 08:20:00', '2026-06-15 08:20:00', 5);
SELECT * FROM carrito;

-- TRANSACCIONES Y OPERATIVAS

-- Insertar datos en la tabla carrito_productos
DESCRIBE carrito_productos;

INSERT INTO carrito_productos (cantidad, productos_id_productos, carrito_id_carrito) 
VALUES
(1, 4, 1),
(2, 5, 1),
(1, 1, 1),
(1, 1, 2),
(1, 3, 2),
(2, 5, 2),
(2, 2, 3),
(1, 4, 3),
(1, 5, 3),
(2, 1, 4),
(1, 2, 4),
(1, 3, 4),
(1, 4, 4),
(1, 3, 5),
(3, 5, 5);
SELECT * FROM carrito_productos;

-- Insertar datos en la tabla pedidos
DESCRIBE pedidos;

INSERT INTO pedidos (numero_pedido, total, estado_pedido, fecha_creacion_pedido, usuarios_id_usuario) 
VALUES
(1001, 540.00, 'Procesando', '2026-06-02 12:00:00', 1),
(1002, 530.00, 'Pagado', '2026-06-06 10:00:00', 2),
(1003, 890.00, 'Enviado', '2026-06-11 09:30:00', 3),
(1004, 520.00, 'Entregado', '2026-06-13 14:00:00', 4),
(1005, 590.00, 'Pendiente', '2026-06-16 11:15:00', 5);
SELECT * FROM pedidos;

-- Insertar datos en la tabla detalle_pedido
DESCRIBE detalle_pedido;

INSERT INTO detalle_pedido (cantidad, precio_total_unitario, pedidos_id_pedidos, productos_id_productos) 
VALUES
-- Pedido 1
(1, 120.00, 1, 1),
(2, 120.00, 1, 2),
(1, 180.00, 1, 3),
-- Pedido 2
(1, 120.00, 2, 2),
(1, 180.00, 2, 3),
(1, 110.00, 2, 4),
(2, 60.00, 2, 5),
-- Pedido 3 
(2, 120.00, 3, 1),
(1, 120.00, 3, 2),
(2, 180.00, 3, 3),
(1, 110.00, 3, 4),
(1, 60.00, 3, 5),
-- Pedido 4
(1, 120.00, 4, 1),
(2, 110.00, 4, 4),
(3, 60.00, 4, 5),
-- Pedido 5
(3, 120.00, 5, 2),
(1, 110.00, 5, 4),
(2, 60.00, 5, 5);
SELECT * FROM detalle_pedido;

-- Insertar datos en la tabla pagos
DESCRIBE pagos;

INSERT INTO pagos (metodo_pago, monto, fecha_pago, pedidos_id_pedidos) 
VALUES
('Tarjeta de Crédito', 540.00, '2026-06-02 12:05:00', 1),
('PayPal', 530.00, '2026-06-06 10:05:00', 2),
('Transferencia', 890.00, '2026-06-11 09:35:00', 3),
('Tarjeta de Débito', 520.00, '2026-06-13 14:05:00', 4),
('OXXO', 590.00, '2026-06-16 12:00:00', 5);
SELECT * FROM pagos;

-- Insertar datos en la tabla pedidos
DESCRIBE envios;

INSERT INTO envios (paqueteria, numero_rastreo, estado_envio, fecha_despacho, fecha_entrega_estimada, pedidos_id_pedidos) 
VALUES
('FedEx', 'FDX-12345', 'En tránsito', '2026-06-03 09:00:00', '2026-06-05', 1),
('DHL', 'DHL-98765', 'Preparando', '2026-06-07 10:00:00', '2026-06-10', 2),
('Estafeta', 'EST-44556', 'Entregado', '2026-06-12 08:30:00', '2026-06-14', 3),
('Mercado Envíos', 'MEL-99887', 'Entregado', '2026-06-14 11:00:00', '2026-06-16', 4),
('Redpack', 'RDP-11223', 'Pendiente', '2026-06-17 09:00:00', '2026-06-20', 5);
SELECT * FROM envios;

SET FOREIGN_KEY_CHECKS = 1;












