# 💎 La Tiendita de la Yeya

### E-commerce de accesorios y joyería — Proyecto Full Stack Java

**La Tiendita de la Yeya** es una plataforma de comercio electrónico desarrollada por un equipo de 9 desarrolladores bajo una metodología ágil basada en **Scrum**.

El proyecto integra **Frontend, Backend y Base de Datos** para crear una experiencia de compra completa, desde la exploración del catálogo y selección de productos hasta el carrito, checkout y gestión administrativa.

---

## 📌 Descripción del proyecto

El proyecto surge a partir de la necesidad de ofrecer una experiencia de compra diferente dentro del mercado de accesorios y joyería.

La propuesta de **La Tiendita de la Yeya** busca alejarse de una experiencia de compra genérica, ofreciendo una plataforma donde los accesorios puedan representar la personalidad, identidad y estilo de cada cliente.

La aplicación fue construida como un sistema e-commerce completo, contemplando tanto la experiencia del usuario como las necesidades operativas del negocio.

---

## 🎯 Objetivo

Desarrollar una plataforma e-commerce funcional, responsiva y organizada que permita:

* Explorar un catálogo de productos.
* Buscar productos fácilmente.
* Filtrar productos por diferentes características.
* Consultar el detalle de cada pieza.
* Seleccionar variantes de productos.
* Gestionar cantidades y stock.
* Agregar productos al carrito.
* Realizar el flujo de compra.
* Gestionar usuarios y pedidos.
* Administrar productos y categorías.
* Consultar información relevante para la operación del negocio.

---

## ✨ Funcionalidades

### 🏠 Página de inicio

La página principal presenta la identidad visual de **La Tiendita de la Yeya** y permite al usuario navegar hacia las diferentes secciones de la plataforma.

El diseño está basado en el concepto visual **"Misticismo Urbano"**, utilizando contrastes, detalles en rosa y las tipografías **Fredoka** y **Montserrat**.

---

### ℹ️ Sección Nosotros

Presenta la identidad, misión y valores de la marca.

La sección busca generar una conexión con el usuario y transmitir el concepto de una tienda enfocada en accesorios con identidad y significado.

---

### 📩 Contacto

Se desarrolló una sección de contacto para facilitar la comunicación entre los usuarios y la tienda.

El formulario cuenta con validaciones para evitar el envío de información incompleta, como la ausencia de correo electrónico o mensaje.

---

### 👤 Registro e inicio de sesión

La plataforma incorpora un sistema de usuarios con validaciones para el registro.

Entre las validaciones implementadas se encuentran:

* Validación de correo electrónico.
* Validación de teléfono.
* Confirmación de contraseña.
* Visualización de contraseña.
* Manejo de información del usuario.

---

### 🛍️ Catálogo

El catálogo permite consultar dinámicamente los productos disponibles.

Los productos son obtenidos desde el Backend mediante una **API REST** y posteriormente representados en el Frontend.

El usuario puede:

* Buscar productos.
* Filtrar por categoría.
* Filtrar por material.
* Filtrar por precio.
* Consultar información básica del producto.
* Acceder al detalle de cada pieza.

---

### 🔎 Detalle de producto

Cada producto cuenta con una vista de detalle donde se presenta información como:

* Nombre.
* Descripción.
* Precio.
* Imagen.
* Stock.
* Variantes disponibles.

La información se obtiene dinámicamente desde el Backend.

---

### 🧩 Variantes de productos

Los productos pueden contar con diferentes variantes.

La relación entre productos y variantes se maneja mediante la entidad:

VariantesHasProductos

Esto permite asociar diferentes variantes a un producto y consultar información específica como:

* Atributos.
* SKU.
* Stock.

Cuando el usuario selecciona una variante, el Frontend actualiza la información correspondiente y valida la disponibilidad antes de agregarla al carrito.

---

### 🛒 Carrito de compras

El proyecto incorpora un carrito lateral tipo **Slide-over**.

El usuario puede agregar productos sin abandonar la página en la que se encuentra.

El carrito permite:

* Agregar productos.
* Seleccionar cantidades.
* Visualizar productos agregados.
* Continuar navegando por el catálogo.

La información del carrito se almacena temporalmente mediante `localStorage`, permitiendo conservar los productos seleccionados durante la navegación.

---

### 📦 Checkout y pedidos

El flujo de compra permite al usuario revisar los productos seleccionados y continuar con el proceso de pedido.

Se contempla:

1. Selección de productos.
2. Carrito.
3. Detalle del pedido.
4. Información de envío.
5. Método de pago.
6. Confirmación del pedido.

---

### 📋 Confirmación de pedido

Después del proceso de compra, el sistema muestra una pantalla de confirmación con información relacionada con el pedido y su seguimiento.

---

### 📊 Panel administrativo

El proyecto incluye un panel administrativo diseñado para centralizar la operación del negocio.

Entre sus funcionalidades se encuentran:

* Gestión del catálogo.
* Administración de productos.
* Gestión de pedidos.
* Administración de clientes.
* Gestión de categorías.
* Gestión de roles.
* Consulta de estadísticas.
* Monitoreo de inventario.

El dashboard contempla indicadores como ventas, pedidos, clientes activos y productos con bajo stock.

---

# 🛠️ Tecnologías utilizadas

## Frontend

* **HTML5**
* **CSS3**
* **JavaScript**
* **Bootstrap 5**
* **Bootstrap Icons**
* **Font Awesome**
* **Google Fonts**

JavaScript se utilizó para proporcionar interactividad, manipular el DOM y consumir los endpoints de la API REST.

---

## Backend

* **Java**
* **Spring Boot**
* **Spring Data JPA**
* **Hibernate**
* **API REST**
* **DTO**
* **Arquitectura por capas**

El Backend se desarrolló utilizando una separación de responsabilidades mediante:

Controller
     ↓
Service
     ↓
Repository
     ↓
Database

---

## Base de datos

* **MariaDB**
* **SQL**

La base de datos utiliza un modelo relacional con entidades relacionadas para representar la información de la plataforma.

Entre las principales entidades se encuentran:

* Usuarios
* Roles
* Productos
* Categorías
* Variantes
* Imágenes de productos
* Pedidos
* Detalles de pedidos
* Pagos
* Envíos

---

# 🔗 Integración Frontend + Backend

Uno de los principales objetivos técnicos del proyecto fue integrar las diferentes capas de la aplicación.

El flujo de información se realiza de la siguiente manera:

Usuario
   ↓
Frontend
   ↓
JavaScript
   ↓
API REST
   ↓
Spring Boot
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MariaDB

Por ejemplo, el catálogo solicita los productos al Backend mediante una petición HTTP:

GET /productos

El Backend procesa la solicitud, consulta la base de datos y devuelve la información al Frontend.

Posteriormente, JavaScript utiliza esos datos para generar dinámicamente las tarjetas de productos.

El mismo principio se utiliza en el detalle del producto y la consulta de sus variantes.

---

# 🏗️ Arquitectura del Backend

El Backend utiliza una arquitectura organizada por capas.

### Controller

Recibe las solicitudes HTTP y expone los endpoints de la API REST.

### Service

Contiene la lógica de negocio y coordina las operaciones necesarias.

### Repository

Se encarga de la comunicación con la base de datos mediante Spring Data JPA.

### Model

Representa las entidades y relaciones de la base de datos.

### DTO

Permite controlar la información que se recibe o devuelve mediante la API.

Esta estructura permite mantener el código organizado y facilita su mantenimiento y evolución.

---

# 🎨 Diseño y experiencia de usuario

El Frontend fue desarrollado considerando una experiencia de usuario sencilla, visual y responsiva.

Se utilizó **Bootstrap** para facilitar la adaptación de las interfaces a diferentes tamaños de pantalla, complementándolo con CSS personalizado.

El diseño visual utiliza:

* Fredoka.
* Montserrat.
* Contrastes de color.
* Detalles en rosa.
* Componentes responsivos.
* Tarjetas de productos.
* Formularios.
* Navegación adaptable.

---

# 🔐 Validaciones

Durante el desarrollo se incorporaron diferentes validaciones tanto en la interacción del usuario como en las operaciones relacionadas con los productos.

Entre ellas:

* Validación de formularios.
* Validación de cantidades.
* Validación de stock.
* Validación de variantes.
* Validación de datos de usuario.
* Validación de información antes de agregar productos al carrito.

---

# 👥 Equipo de desarrollo

El proyecto fue desarrollado colaborativamente por un equipo de **9 desarrolladores**, trabajando bajo la metodología **Scrum**.

### Integrantes

* Ariadna Jazmín Vera Iglesias
* Brandon Essaw Cortez Beltrán
* Cristian Giovany Rodriguez Rosales
* Ernesto Nava Hernandez
* Irán Daniela Gutiérrez Salazar
* Israel Josue Martinez Ruiz
* Joyce Martinez Zubieta
* Noe Santiago Lopez Damian
* Yazmin Aurora Silva Olivares

El equipo se organizó en diferentes responsabilidades relacionadas con:

* Product Ownership.
* Scrum.
* Diseño.
* Frontend.
* Backend.
* Base de datos.
* Integración y desarrollo Full Stack.

---

# 🔄 Metodología de trabajo

El desarrollo se realizó utilizando **Scrum** como marco de trabajo ágil.

Para la organización y colaboración del equipo se utilizaron herramientas como:

* Jira
* Git
* GitHub
* Figma
* Postman
* IntelliJ IDEA

El uso de Git permitió trabajar mediante ramas independientes y posteriormente integrar los cambios al desarrollo principal.

---

# 📚 Aprendizajes del proyecto

El desarrollo de **La Tiendita de la Yeya** permitió trabajar sobre un proyecto Full Stack completo y aplicar conocimientos técnicos en un escenario práctico.

Entre los principales aprendizajes se encuentran:

* Desarrollo de aplicaciones web.
* Creación y consumo de APIs REST.
* Desarrollo Backend con Java y Spring Boot.
* Arquitectura por capas.
* Uso de JPA/Hibernate.
* Modelado de bases de datos relacionales.
* Manejo de relaciones entre entidades.
* Desarrollo de interfaces responsivas.
* Manipulación del DOM con JavaScript.
* Integración Frontend–Backend.
* Gestión de variantes de productos.
* Manejo de inventario.
* Implementación de funcionalidades de e-commerce.
* Trabajo colaborativo con Git y GitHub.
* Resolución de conflictos entre ramas.
* Trabajo bajo metodología Scrum.

---

# 🚀 Resultado

Como resultado se desarrolló una plataforma e-commerce que integra:

Frontend
    +
Backend
    +
API REST
    +
Base de datos
    +
Panel administrativo

El proyecto permitió al equipo trabajar sobre el ciclo completo de desarrollo de una aplicación web, desde el diseño de las interfaces y modelado de datos hasta la implementación, integración y prueba de las diferentes funcionalidades.

---


# 📌 Estado del proyecto

**Proyecto Full Stack desarrollado de manera colaborativa.**

El proyecto fue construido como una aplicación e-commerce funcional integrando Frontend, Backend y Base de Datos.

---

## 💎 La Tiendita de la Yeya

**Proyecto desarrollado por el equipo Los Java DavaDu.**

> Autenticidad · Honestidad · Confianza · Inclusión
