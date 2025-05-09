$(document).ready(function () {
    // Datos dinámicos
    let body = $("body");
    /**
     * Título del 'breadcrumb'.
     * <br>
     * Se debe declarar como: data-title='Title'
     * 
    
     * @type type
     */
    let title = body.data("title");
    /**
     * Nombres de los grupos como subtítulos en el 'breadcumb'.
     * <br>
     * Se debe declarar como: data-subtitle="Subtitle1, Subtitle2"
     * 
    
     * @type type
     */
    let subtitle = (body.data("subtitle") || "").split(',').map(item => item.trim());
    /**
     * Permite dejar activo el nodo en el 'sidebar'.
     * <br>
     * Se debe declarar como: data-node='node_name'
     * 
    
     * @type type
     */
    let node = body.data("node");

    if (node)
        setActiveNode(node);
    if (title && subtitle)
        setBreadCrumb(title, subtitle);
    
    /**
    * Redimenciona los headers de los DataTables
    */
    resizeHandler($('.js-datatable'));
});

/**
 * Configuración para el conteo de dígitos
 * 
 * @deprecated Utilizar función <code>$('#myID').setCounter(int)</code>

 * @type type
 */
const counter_settings = {
    countFrom: 0,
    numberFormatter: function (number) {
        return formatNumberThousand(number);
    },
    onComplete: function () {
        //plugin = counter.data("plugin_counter"); // Retrieve the plugin object
    }
};

/**
 * BreadCrumb: Se entrega el título en el primer parámetro, el resto compone
 * la ruta de las secciones en el orden entregado.
 *

 * @param {type} title
 * @param {type} breadcrumb
 * @returns {undefined}
 */
function setBreadcrumb(title, ...breadcrumb) {
    // Título
    //$("#content-title").html(title);

    // BreadCrumb
    // Obtener el elemento con la clase "breadcrumb"
    var bc_ele = $(".breadcrumb");

    // Crear la estructura de migas de pan
    var breadcrumbNav = $("<nav></nav>").attr("aria-label", "breadcrumb");
    var olList = $("<ol></ol>").addClass("breadcrumb breadcrumb-no-gutter");

    // Recorrer el array y crear los elementos de la lista
    $.each(breadcrumb, function (index, item) {
        var listItem = $("<li></li>").addClass("breadcrumb-item");

        if (index === breadcrumb.length - 1) {
            // Último elemento: activo y sin enlace
            listItem.addClass("active").attr("aria-current", "page").text(item);
        } else {
            // Elemento no activo con enlace
            var link = $("<a></a>").addClass("breadcrumb-link").attr("href", "javascript:;").text(item);
            listItem.append(link);
        }

        // Agregar elemento a la lista
        olList.append(listItem);
    });

    // Agregar la lista al elemento breadcrumb
    breadcrumbNav.append(olList);
    bc_ele.html(breadcrumbNav);
}

// Evento: Al hacer clic sobre un elemento 'nav-link' este se marcará como 'active'.
$('.nav-link-node').click(function () {
    setActiveNode(this);
});


/**
 * Marcar el 'nav-link' entregado como 'active'.
 *

 * @param {type} node ID del nodo
 * @returns {undefined}
 */
function setActiveNode(node) {
    if (Object.prototype.toString.call(node) === '[object String]')
        node = "#nav-link-" + node;
    // Quita la clase "active" a todos los nodos encontrados
    $(".nav-link-node").removeClass("active");
    // Solo añade la clase "active" al nodo correspondiente
    $(node).addClass("active");
    // En caso de ser un nodo dentro de un 'collapse' este se expandirá
    let parent = $(node).closest(".nav-collapse");
    // Se añade la calse "show" al 'collapse'
    parent.addClass("show");
}

function setBreadCrumb() {
    // Obtener los datos de los items del atributo data-subtitle del body
    var title = $('body').data('title');
    var subtitle = $('body').data('subtitle');
    var items = subtitle.split(',').map(item => item.trim());

    // Crear el breadcrumb dinámicamente
    var $breadcrumb_title = $(".page-header-title");
    var $breadcrumb = $('.breadcrumb-data');
    var $ol = $('<ol class="breadcrumb breadcrumb-no-gutter">');

    // Agregar cada item al breadcrumb
    $.each(items, function (index, item) {
        var $li = $('<li class="breadcrumb-item">');

        if (index === items.length - 1) {
            $li.addClass('active').attr('aria-current', 'page').text(item);
        } else {
            var $a = $('<a class="breadcrumb-link" href="javascript:;">').text(item);
            $li.append($a);
        }
        $ol.append($li);
    });

    // Agregar el breadcrumb al contenedor deseado en el DOM
    $breadcrumb.html($ol);
    $breadcrumb_title.html(title);

    //$('#breadcrumbContainer').append($breadcrumb);    
}

function setBreadCrumb_(node, breadcrumb) {
    $("#content-title").html(node); //Titulo
    var bread = "";

    for (var i = 0; i < breadcrumb.length; i++) {
        bread += "<li class='breadcrumb-item'>" + breadcrumb[i] + "</li>";
    }

    $(".breadcrumb").html(bread);
}

/**
 * Limpia el sidebar dejándolo SIN nodos activos.
 * 

 * @returns {undefined}
 */
function removeAllActiveNodes() {
    // Solo tendrá efecto sobre el sidebar
    let container = $(".navbar-vertical-content");

    // Remover la clase 'active' de todos los enlaces principales
    container.find('.nav-link.dropdown-toggle').removeClass('active');

    // Remover la clase 'active' de todos los nodos
    container.find('.nav-link').removeClass('active');

    // Remover la clase 'show' de todos los menús desplegables
    container.find('.nav-item .collapse').removeClass('show');

    // Remover cualquier atributo 'aria-expanded' existente en los enlaces principales
    container.find('.nav-link.dropdown-toggle').attr('aria-expanded', 'false');
}

/**
 * Deja activo el nodo correspondiente
 * 

 * @param {String} node
 * @returns {undefined}
 */
function setActiveNode(node) {
    let ele = $(`.nav-link.${node}`);
    let parent = ele.closest('.nav-item');

    // Limpia los nodos activos
    removeAllActiveNodes();

    // Agrega la clase 'active' al enlace principal (padre) del nodo
    // -> Desactivado temporalmente.
    //parent.find('.nav-link.dropdown-toggle').addClass('active');

    // Agrega la clase 'active' al nodo
    ele.addClass('active');

    // Expande el menú "padre" del nodo
    parent.find('.collapse').addClass('show');

    // Establece 'aria-expanded' en 'true' para el enlace del nodo
    parent.find('.dropdown-toggle').attr('aria-expanded', 'true');
    parent.find('.dropdown-toggle').addClass('collapsed active');
}

/**
 * Muestra un mensaje 'Toast' personalizado.
 * Se debe instanciar el tipo de mensaje en base a esta función.
 *
 * Uso: showToastr('title', 'body').info(); -> Muestra un mensaje de información.
 *
 * Para personalización: showToastr('title', 'body')
 *                       .setTime(2) // -> Establece 2 segundos de visualización
 *                       .setPosition('toast-bottom-left') // -> Posición en pantalla del mensaje
 *                       .success(); // -> Tipo de mensaje "Exitoso"
 *
 * @source https://github.com/petekeller2/toastr
 * @demo https://codeseven.github.io/toastr/demo.html
 * @param {String} title - Título del mensaje
 * @param {String} body  - Cuerpo del mensaje
 * @param {Integer} [Opciona] timeOut - Tiempo de duración de muestra del mensaje (En segundos. Por defecto: 5)
 * @param {String} [Opcional] positionClass - Posición del mensaje en la pantalla.
 * @param {String} body  - Cuerpo del mensaje

 * @returns {showToastr.obj}
 */
function showToastr(title, body) {
    const function_name = "[showToastr]";

    /* Clases para la propiedad "positionClass"
     *
     * toast-top-right -> Superior derecha
     * toast-bottom-right -> Inferior derecha
     * toast-bottom-left -> Inferior izquierda
     * toast-top-left -> Superior izquierda
     * toast-top-full-width -> Superior extendida (Utiliza el 80% de la pantalla)
     * toast-bottom-full-width -> Inferior extendida (Utiliza el 80% de la pantalla)
     * toast-top-center -> Superior centrado
     * toast-bottom-center -> Inferior centrado
     */

    // Valores para validar ciertos parámetros
    let min_timeout = 2; // Mínimo de Segundos para mostrar un 'toast'
    let max_timeout = 15; // Máximo de Segundos para mostrar un 'toast'
    let valid_position = `
     * toast-top-right -> Superior derecha
     * toast-bottom-right -> Inferior derecha
     * toast-bottom-left -> Inferior izquierda
     * toast-top-left -> Superior izquierda
     * toast-top-full-width -> Superior extendida (Utiliza el 80% de la pantalla)
     * toast-bottom-full-width -> Inferior extendida (Utiliza el 80% de la pantalla)
     * toast-top-center -> Superior centrado
     * toast-bottom-center -> Inferior centrado
     `;

    toastr.options = {
        "closeButton": true, // Muestra un botón (X) para cerrarse
        "debug": false,
        "newestOnTop": true, // Los 'toast' nuevos se mostrarán siempre arriba.
        "progressBar": true, // Muestra una barra de progreso del tiempo restante.
        "positionClass": "toast-bottom-right", // Posición del 'toast'
        "preventDuplicates": false, // Evita que se generen más 'toast' si hay uno a la vista
        "onclick": null, // Evento al hacer clic sobre el mensaje.
        "showDuration": "300",
        "hideDuration": "1000", // Tiempo de duración de desvanecido
        "timeOut": "5000", // Tiempo de duración que tendrá al mostrarse
        "extendedTimeOut": "1000", // Tiempo de duración a extender al posicionarse sobre el 'toast'
        "showEasing": "easeOutBounce", // Obtener más animaciones en: https://gsgd.co.uk/sandbox/jquery/easing/
        "hideEasing": "easeInBack",
        "closeEasing": "easeInBack",
        "showMethod": "slideDown",
        "hideMethod": "slideUp",
        "closeMethod": "slideUp",
        "escapeHtml": false
    };

    // Título por defecto
    if (!body) {
        body = title;
        title = "¡Atención!";
    }

    const obj = {
        info: function () {
            toastr.info(body, title);
        },
        success: function () {
            toastr.success(body, title);
        },
        warning: function () {
            toastr.warning(body, title);
        },
        error: function () {
            toastr.error(body, title);
        },
        /**
         * Establece el tiempo de visualización (en segundos) del mensaje 'toast'
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setTime: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(`${function_name} El parámetro de la función 'setTime' no es válido.`);

                return null;
            }

            val = parseInt(val);

            // Valida el mínimo y máximo de segundos
            if (val !== -1 && (val < min_timeout || val > max_timeout)) {
                console.error(`${function_name} El parámetro de la función 'setTime' no es válido.
                            \nEl valor debe ser entre '${min_timeout}' y '${max_timeout}'.
                            \nEl valor recibido es '${val}'`);

                return null;
            }
            // Se multiplica por 1000 (milésimas)
            val *= 1000;

            toastr.options.timeOut = val;

            return obj;
        },
        /**
         * Establece la ubicación en pantalla del mensaje 'toast'.
         * <br>
         * <br>
         * <b>NOTA:</b> Utiliza la constante <code>TOASTR_PLACEMENT</code>.
         * <br>
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setPosition: function (val) {
            if (isNullOrEmpty(val)) {
                console.error(`${function_name} El parámetro de la función 'setLocation' es inválido.\n
                              Utiliza alguno de los siguientes: \n\n
                              ${valid_position}`);
                return null;
            }

            toastr.options.positionClass = val;

            return obj;
        },
        /**
         * true: Evita que se dupliquen los mensajes mientras haya 1 en pantalla
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setPreventDuplicates: function (val) {
            //options.customClass = {...properties.customClass, confirmButton: val};
            if (isNullOrEmpty(val) || typeof val !== 'boolean') {
                console.log(`${function_name} El parámetro de la función 'setPreventDuplicates' no es válido.`);

                return null;
            }

            toastr.options.preventDuplicates = val;

            return obj;
        },
        /**
         * Muestra una "X" para cerrar el mensaje
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setCloseButton: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'boolean') {
                console.error(`${function_name} El parámetro de la función 'setCloseButton' no es válido.`);

                return null;
            }

            toastr.options.closeButton = val;

            return obj;
        },
        /**
         * Establece la animación que tendrá el mensaje al <b>mostrarse</b>.
         * Propiedades válidas:
         * <br>
         * <ul>
         * <li>• hide</li>
         * <li>• fadeOut</li>
         * <li>• slideUp</li>
         * </ul>
         *
        
         * @param {type} val
         * @returns {setShowMethod.obj}
         */
        setShowMethod: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'string') {
                console.error(`${function_name} El parámetro de la función 'setShowMethod' no es válido.`);

                return null;
            }

            toastr.options.showMethod = val;

            return obj;
        },
        /*
         * Establece la animación que tendrá el mensaje al <b>esconderse</b>.
         * Propiedades válidas:
         * <br>
         * <ul>
         * <li>• show</li>
         * <li>• fadeIn</li>
         * <li>• slideDown</li>
         * </ul>
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setHideMethod: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'string') {
                console.error(`${function_name} El parámetro de la función 'setHideMethod' no es válido.`);

                return null;
            }

            toastr.options.hideMethod = val;

            return obj;
        },
        /*
         * Establece la animación que tendrá el mensaje al <b>mostrarse</b>.
         * <br>
         * Utiliza la siguiente documentación para obtener las propiedades válidas:
         * <br>
         * <a href="https://gsgd.co.uk/sandbox/jquery/easing/"></a>
         *
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setShowEasing: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'string') {
                console.error(`${function_name} El parámetro de la función 'setShowEasing' no es válido.`);

                return null;
            }

            toastr.options.showEasing = val;

            return obj;
        },
        /*
         * Establece la animación que tendrá el mensaje al <b>esconderse</b>.
         * <br>
         * Utiliza la siguiente documentación para obtener las propiedades válidas:
         * <br>
         * <a href="https://gsgd.co.uk/sandbox/jquery/easing/"></a>
         *
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setHideEasing: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'string') {
                console.error(`${function_name} El parámetro de la función 'setHideEasing' no es válido.`);

                return null;
            }

            toastr.options.hideEasing = val;

            return obj;
        },
        /*
         * Establece la animación que tendrá el mensaje al <b>cerrarse</b>.
         * <br>
         * Utiliza la siguiente documentación para obtener las propiedades válidas:
         * <br>
         * <a href="https://gsgd.co.uk/sandbox/jquery/easing/"></a>
         *
         *
        
         * @param {type} val
         * @returns {showToastr.obj}
         */
        setCloseEasing: function (val) {
            if (isNullOrEmpty(val) || typeof val !== 'string') {
                console.error(`${function_name} El parámetro de la función 'setCloseEasing' no es válido.`);

                return null;
            }

            toastr.options.closeEasing = val;

            return obj;
        },
        /**
         * Establece funciones que se ejecutarán al <b>mostrarse</b> el mensaje.
         *
        
         * @param {type} callback
         * @returns {showToastr.obj}
         */
        onShown: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'onShown'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            toastr.options.onShown = callback;

            return obj;
        },
        /**
         * Establece funciones que se ejecutarán al <b>ocultarse</b> el mensaje.
         *
        
         * @param {type} callback
         * @returns {showToastr.obj}
         */
        onHidden: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'onHidden'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            toastr.options.onHidden = callback;

            return obj;
        },
        /**
         * Establece funciones que se ejecutarán al hacer <b>clic sobre</b> el mensaje.
         *
        
         * @param {type} callback
         * @returns {showToastr.obj}
         */
        onClick: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'onClick'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            toastr.options.onclick = callback;

            return obj;
        },
        /**
         * Establece funciones que se ejecutarán al hacer <b>clic en el botón 'cerrar'</b> del mensaje.
         *
        
         * @param {type} callback
         * @returns {showToastr.obj}
         */
        onCloseClick: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'onCloseClick'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            toastr.options.onCloseClick = callback;

            return obj;
        },
    };

    return obj;
}

/**
 * Muestra un Toastr a partir de la variable "data" obtenida desde un Servlet.
 * 

 * @param {type} data
 * @returns {undefined|showToastr.obj}
 */
function showToastrCustom(data) {
    let type = setTipoMessage(data.internalCode);
    let title = setTitleMessage(data.internalCode);

    let toastr = showToastr(title, data.description);

    switch (type) {
        case "success":
            toastr.success();
            break;
        case "warning":
            toastr.warning();
            break;
        case "error":
            toastr.error();
            break;
        default: // Info
            toastr.info();
            break;
    }
}

/**
 * Muestra un mensaje 'SweetAlert' personalizando sus propiedades.
 *

 * @returns {setSweetAlert.obj}
 */
function setSweetAlert() {
    const function_name = "[setSweetAlert]";

    // Propiedades por defecto
    let properties = {
        title: 'Operación exitosa',
        html: "",
        icon: 'warning',
        confirmButtonColor: '#fc8711',
        allowOutsideClick: false,
        returnFocus: false
    };

    let customCss = {
        "confirmButton": "btn btn-blue",
        "cancelButton": "btn btn-grey",
        "denyButton": "btn btn-danger"
    };

    const obj = {
        /**
         * Muestra la alerta 'SweetAlert'
         *
         * @returns {unresolved}
         */
        show: function () {
            return Swal.fire(properties);
        },
        setTitle: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setTitle'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.title = val;

            return obj;
        },
        setMessage: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setMessage'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.html = val;

            return obj;
        },
        setIcon: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setIcon'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.icon = val;

            return obj;
        },
        setFooter: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setFooter'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.footer = val;

            return obj;
        },
        setConfirmButtonText: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setConfirmButtonText'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.confirmButtonText = val;

            return obj;
        },
        setCancelButtonText: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setCancelButtonText'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.cancelButtonText = val;

            return obj;
        },
        setDenyButtonText: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setDenyButtonText'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.denyButtonText = val;

            return obj;
        },
        showDenyButton: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'showDenyButton'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.showDenyButton = val;

            return obj;
        },
        showConfirmButton: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'showConfirmButton'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.showConfirmButton = val;

            return obj;
        },
        showCancelButton: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'showCancelButton'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.showCancelButton = val;

            return obj;
        },
        setTimer: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setTimer'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.timer = val;

            return obj;
        },
        setPosition: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setPosition'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.position = val;

            return obj;
        },
        setConfirmButtonColor: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setConfirmButtonColor'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.confirmButtonColor = val;

            return obj;
        },
        setCancelButtonColor: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setCancelButtonColor'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.cancelButtonColor = val;

            return obj;
        },
        setDenyButtonColor: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setDenyButtonColor'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.denyButtonColor = val;

            return obj;
        },
        /**
         * Invierte los botones "Confirmar" y "Cancelar" quedando
         * "Cancelar" a la izquierda y "Confirmar" a la derecha.
         *
         * @param {type} val
         * @returns {setSweetAlert.obj}
         */
        setReverseButtons: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setReverseButtons'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.reverseButtons = val;

            return obj;
        },
        setConfirmButtonClass: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setConfirmButtonClass'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.customClass = {...properties.customClass, confirmButton: val};

            return obj;
        },
        setCancelButtonClass: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setCancelButtonClass'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            //properties.customClass = Object.assign({}, customCss, {cancelButton: val});
            properties.customClass = {...properties.customClass, cancelButton: val};

            return obj;
        },
        setDenyButtonClass: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setDenyButtonClass'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            //properties.customClass = Object.assign({}, customCss, {denyButton: val});
            properties.customClass = {...properties.customClass, denyButton: val};

            return obj;
        },
        setButtonsStyling: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setButtonsStyling'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.buttonsStyling = val;

            return obj;
        },
        setFocusConfirm: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setFocusConfirm'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.focusConfirm = val;

            return obj;
        },
        setIconColor: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setIconColor'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.iconColor = val;

            return obj;
        },
        setFocusCancel: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setFocusCancel'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.focusCancel = val;

            return obj;
        },
        setFocusDeny: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setFocusDeny'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.focusDeny = val;

            return obj;
        },
        setAllowEnterKey: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setAllowEnterKey'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.allowEnterKey = val;

            return obj;
        },
        setReturnFocus: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setReturnFocus'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.returnFocus = val;

            return obj;
        },
        setInput: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setInput'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.input = val;

            return obj;
        },
        setInputPlaceholder: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setInputPlaceholder'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.inputPlaceholder = val;

            return obj;
        },
        setInputValue: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setInputValue'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.inputValue = val;

            return obj;
        },
        setInputClass: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setInputClass'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.customClass = {...properties.customClass, input: val};
            //properties.inputAttributes = val;

            return obj;
        },
        setInputValidator: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setInputValidator'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.inputValidator = function (result) {
                if (!result) {
                    return val;
                }
            };

            return obj;
        },
        setWidth: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setWidth'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.width = val;

            return obj;
        },
        setCustomClass: function (container, val) {
            if (isNullOrEmpty(val) || isNullOrEmpty(container)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setCustomClass'.\n
                        • Valor declarado: ${container} y ${val}
                        `
                        );
                return null;
            }
            properties.customClass = {...properties.customClass, [container]: val};

            return obj;
        },
        setIconHtml: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setIconHtml'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.iconHtml = val;

            return obj;
        },
        preConfirm: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'preConfirm'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            properties.preConfirm = callback;

            return obj;
        },
        showLoaderOnConfirm: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'showLoaderOnConfirm'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.showLoaderOnConfirm = val;

            return obj;
        },
        preDeny: function (callback) {
            if (isNullOrEmpty(callback)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'preDeny'.\n
                        • Valor declarado: ${callback}
                        `
                        );
                return null;
            }
            properties.preDeny = callback;

            return obj;
        },
        showLoaderOnDeny: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'showLoaderOnDeny'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.showLoaderOnDeny = val;

            return obj;
        },
        setAllowOutsideClick: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setAllowOutsideClick'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.allowOutsideClick = val;

            return obj;
        },
        setAllowEscapeKey: function (val) {
            if (isNullOrEmpty(val)) {
                console.log(
                        `${function_name} El parámetro entregado no es válido en 'setAllowEscapeKey'.\n
                        • Valor declarado: ${val}
                        `
                        );
                return null;
            }
            properties.allowEscapeKey = val;

            return obj;
        }
    };

    return obj;
}

/**
 * Mostrar un Toast
 * 

 * @param {type} tipo
 * @param {type} titulo
 * @param {type} mensaje
 * @returns {undefined}
 */
function showToast(tipo, titulo, mensaje) {
    notify(setTipoMessage(tipo), titulo, mensaje, '3000');
}

/**
 * Mostrar un SnackBar
 * 

 * @param {type} tipo
 * @param {type} mensaje
 * @returns {undefined}
 */
function showSnack(tipo, mensaje) {
    $.snack(setTipoMessage(tipo), mensaje, '5000');
}

/**
 * Asignar el tipo de mensaje de acuerdo al código.
 * 

 * @param {type} tipo
 * @returns {String}
 */
function setTipoMessage(tipo) {
    if (tipo === 1 || (tipo >= 1000 && tipo <= 1999))
        return 'success';

    if (tipo === 2 || (tipo >= 2000 && tipo <= 2999))
        return 'warning';

    if (tipo === -1 || (tipo >= 3000 && tipo <= 3999))
        return 'error';

    return 'info';
}

/**
 * Asignar el tipo de mensaje de acuerdo al código.
 * 

 * @param {type} tipo
 * @returns {String}
 */
function setTitleMessage(tipo) {
    if (tipo === 1 || (tipo >= 1000 && tipo <= 1999))
        return '¡Operación exitosa!';

    if (tipo === 2 || (tipo >= 2000 && tipo <= 2999))
        return '¡Atención!';

    if (tipo === -1 || (tipo >= 3000 && tipo <= 3999))
        //return 'Ha ocurrido un error';
        return '¡Atención!';

    return '¡Atención!';
}

/**
 * Muestra una ventana de espera cuando se realiza una operación de datos.
 * 

 * @returns {unresolved}
 */
function showProccessToast() {
    return Swal.fire({
        icon: 'info',
        title: 'Procesando solicitud',
        text: 'Por favor, espere...',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        stopKeydownPropagation: true
    });
    //Swal.getFocusableElements();
}

/**
 *  Muestra un mensaje de error interno.
 *

 * @param {string} val - Mensaje personalizado
 * @returns {undefined}
 */
function showErrorToast(val) {
    data = {};
    data.internalCode = 3000;
    data.description = val || "Ha ocurrido error en la solicitud.<br>Por favor, recarga e intenta nuevamente";

    showMessageToast(data).then((result) => {
        if (result.isConfirmed) {
            location.reload();
        }
    });
}

/**
 * Muestra un mensaje personalizado cuando se realiza una operación.
 * 
 * @param {type} data
 * @returns {showMessageToast.msg}
 */
function showMessageToast(data) {
    let msg = Swal.fire({
        title: setTitleMessage(data.internalCode),
        html: data.description,
        icon: setTipoMessage(data.internalCode),
        confirmButtonColor: '#009ef7',
        confirmButtonText: 'Aceptar',
        returnFocus: false,
        allowOutsideClick: false
                // Nuevo
                /*buttonsStyling: false,
                 customClass: {
                 confirmButton: "btn btn-blue"
                 }*/
    });

    // Verificación cuando vence la sesión
    msg.then((result) => {
        if (result.isConfirmed) {
            if (data.responseCode === -403) {
                window.location.replace(data.destiny);
            }
        }
    });

    return msg;
}

/**
 * Cierra todas las instancias de SweetAlert
 * 
 * @returns {undefined}
 */
function closeAllToast() {
    Swal.close();
}

/**
 * Cierra todos los modals abiertos
 * 
 * @returns {undefined}
 */
function closeAllModal() {
    try {
        $('.modal').modal('hide');
    } catch (e) {
        console.error("No se encontraron 'modal' que cerrar");
    }
}

/* Verifica que el valor entregado contenga datos
 *

 * @param {String} val
 * @return {boolean}
 */
function isNullOrEmpty(val) {
    /**
     * Operador que verifica si el objeto principal y el atributo requerido son nulos para retornar un valor por defecto.
     *
     *  data?.object ?? "valor por defecto"
     *
     *  Esto reemplazaría el código:
     *      (data !=null && data.object !=null) ? data.object : "valor por defecto"
     *
     *
     */
    return (
            val === null // Si está nulo
            || typeof val === "undefined" // Si está indefinido
            || val === "null" // Si está "nulo"
            || val === "" // Si está vacío
            || val.toString().length === 0 // Si está vacío (largo 0)
            || (typeof val === 'integer' && isNaN(val)) // Si es numérico, verifica que sea válido
            //|| !val
            );
}

// Muestra un toast con la libreria Toastify
// Parametros: texto, duración en milisegundos y color en o el texto de acuerdo a los case HEX (ej: #ed4c78)
// Colores parametrizados: blue -> #377dff / danger -> #ed4c78 / success -> #20a15c

function showToastifyCustom(text, duration, color) {

    let customColor = "";
    switch (color) {
        case "blue":
            customColor = "#377dff";
            break;
        case "danger":
            customColor = "#ed4c78";
            break;
        case "success":
            customColor = "#20a15c";
            break;
        case "info":
            customColor = "#09a5be";
            break;
        case "warning":
            customColor = "#f5ca99";
            break;
        default:
            customColor = color;
            break;
    }

    Toastify({
        text: text,
        duration: duration,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: customColor
        }
    }).showToast();
}

/**
 * Verifica que se ingresen solo dígitos en un 'input'
 * @param {type} ele
 * @param {type} e
 * @returns {Boolean}
 */
function verifyOnlyNumber(ele, e) {
    let _self = $(ele);
    let min = parseInt(_self.attr("min"));
    let max = parseInt(_self.attr("max"));
    let len = _self.val().length;

    if (len > max)
        return false;

    key = (document.all) ? e.keyCode : e.which;
    // Tecla de retroceso para borrar. Siempre la permite
    if (key === 8) {
        return true;
    }
    // Tecla de espaceadora. Siempre la permite
    if (key === 32) {
        return true;
    }

    patron = /[0-9]/; //regex que permite solo numeros
    tecla_final = String.fromCharCode(key);
    return patron.test(tecla_final);
}

/**
 * Event 'keyPress': Permite validar el tipo de dato y largo de un 'input'
 * 

 */
$("body").on("keypress", ".only-numbers", function (e) {
    return verifyOnlyNumber(this, e);
});


/**
 * Event 'keyPress': Permite validar el tipo de dato y largo de un 'input'
 * 

 */
$("body").on("paste", ".only-numbers", function (e) {
    return verifyOnlyNumber(this, e);
});

/**
 * Procesa los datos ingresados en el campo y retorna en formato RUT.
 * 
 * Validaciones:
 * • Solo permite ingresar la letra 'K' cuando el largo de dígitos ingresados sea mayor a 7.
 * • Restringe el ingreso de más datos una vez ingresada la letra 'K'.
 * • Al pegar un valor en el campo este es truncado al máximo de caracteres permitido en el campo.
 * 
 * Ej: 123456789 -> 12.345.678-9
 * 

 * @param {type} field
 * @returns {jQuery}
 */
function formatRut(field) {
    // Cantidad máxima de caracteres permitidos en el campo
    let max_len = 12; // -> Incluye los puntos y guión
    let max_len_cleaned = 9; // -> Solo dígitos y leta K
    // Reemplaza cualquiera caracter no permitido por 'vacío' permitiendo solo el ingreso de dígitos y la letra 'K'.
    let rut = $(field).val().replace(/[^0-9kK]/g, '').toUpperCase(); // Elimina caracteres no permitidos
    // Elimina puntos y guiones si se ingresaron manualmente
    let cleanedRut = rut.replace(/[.-]/g, ''); // Elimina puntos y guiones si existen
    // Cantidad de caracteres ingresados
    //let len = cleanedRut.length > max_len ? max_len : cleanedRut.length;
    let len = cleanedRut.length;

    // Verifica que no se supere el máximo de caracteres limpios permitidos (no incluye puntos ni guión)
    if (len > max_len_cleaned) {
        cleanedRut = cleanedRut.slice(0, max_len_cleaned);
    }

    // Si la cantidad de caracteres ingresados es menor o igual a 1 verifica si se ha ingresado la letra 'K';
    // De ser así se quitará y dejará en blanco el campo.
    if (len <= 1) {
        if (cleanedRut.includes("K"))
            cleanedRut = rut.replace(/[kK]/g, '');
        return $(field).val(cleanedRut);
    }

    // Si el largo de caracteres ingresados es menor a 7 dígitos NO se permite ingresar la letra 'K'
    regex = (len <= 7)
            ? /[^0-9]/g
            : /[^0-9kK]/g;
    cleanedRut = cleanedRut.replace(regex, '');
    // Formatea los digitos añadiendo puntos y guión.
    var formatted = cleanedRut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleanedRut.slice(-1);

    // Verifica si se ingresó la letra "K" y evita la entrada de más datos
    $(field).attr("maxlength",
            cleanedRut.includes('K') ? len : max_len); // -> Deja como tamaño máximo el largo de caracteres actual

    return $(field).val(formatted);
}

/**
 * Retorna el elemento inicializado del Rango de fechas
 *

 * @returns {undefined}
 */
$.fn.Daterangepicker = function () {
    return this.data("daterangepicker");
};

/**
 * Inicializa el Rango de fechas.
 *

 * @returns {undefined}
 */
$.fn.initDaterangepicker = function (customProps) {
    let defaultProps = {
        "maxYear": 2100,
        "showWeekNumbers": true, // Muestra el número de semana en el mes
        "showDropdowns": true, // Permite cambiar los meses y años desde un elemento 'select'
        "singleDatePicker": false, // Habilita solo 1 calendario
        "maxSpan_DISABLED": {// Especifica la cantidad de unidades de tiempo máximo a seleccionar en el rango (days, months, years)
            "months": 1
        },
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta", // Etiqueta del "hasta"
            "customRangeLabel": "Personalizado",
            "weekLabel": "Sem", // Etiqueta de "Semana"
            "daysOfWeek": [
                "Dom",
                "Lun",
                "Mar",
                "Mié",
                "Jue",
                "Vie",
                "Sáb"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 1
        },
        "parentEl": "",
        "startDate": moment(),
        "endDate": moment(),
        //"minDate": "0802222222",
        "opens": "center", // Alineación al abrir (center, left, right)
        //"drops": "up", // Hacia dónde abrirá el calendario (up, down, auto)
        "applyButtonClasses": "btn-blue", // Clase personalizada para el botón de "Aplicar"
        "cancelClass": "btn-white", // Clase personalizada para el botón de "Cancelar"
        "buttonClasses": "btn btn-xs", // Clase personalizada que aplica a todos los botones
        "alwaysShowCalendars": true,
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días': [moment().subtract(29, 'days'), moment()],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Mes pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    };

    // Función que inicializa el elemento
    let drp = this.daterangepicker(
            $.extend({}, defaultProps, customProps),
            /*function (start, end, label) {
             //console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
             }*/
            );
};

/**
 * Permite descargar mediante AJAX los archivos generados desde un Servlet.
 *

 * @param {type} data - Parámetro entregado por el "success" de Ajax
 * @param {type} xhr - Parámetro entregado por el "success" de Ajax
 * @param {string} default_filename - Nombre por defecto en caso de no obtenerlo desde el Servlet (debe incluir la extensión).
 */
function downloadFileFromServlet(data, xhr, default_filename) {
    var filename = "";
    var disposition = xhr.getResponseHeader("Content-Disposition");

    if (disposition && disposition.indexOf("attachment") !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
        }
    }
    // Crear un objeto URL con los datos recibidos
    var url = URL.createObjectURL(data);

    // Crear un enlace temporal y hacer clic en él para iniciar la descarga
    var link = document.createElement("a");
    link.href = url;
    link.download = filename || default_filename;
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
}

/**
 * Función que permite realizar descargas de archivos generados por Servlets pero a través
 * de una llamada por Ajax.
 *
 * Las ventajas son que podrás utilizar los <code>callbacks</code> de Ajax y manejar acciones
 * Antes, Después y en caso de Errores en la llamada.
 *

 * @returns {undefined}
 */
function downloadFileAjax() {
    var self = this;
    self.url = '';
    self.data = {};
    self.successCallback = null;
    self.errorCallback = null;
    self.beforeSendCallback = null;
    self.completeCallback = null;
    self.defaultFilename = "archivo";
    self.type = "get";

    /**
     * Establece el nombre del archivo que tendrá por defecto al no obtenerse desde
     * el Servlet.
     *
    
     * @param {string} filename
     * @returns {DownloadManager}
     */
    self.setType = function (type) {
        if (isNullOrEmpty(type) || (type !== "post" && type !== "get")) {
            console.warn(`El valor entregado en 'setType' es inválido.<br>Valor: ${type}<br>Por defecto: GET`);

            type = "get";
        }
        self.type = type;
        return self;
    };

    /**
     * Establece el nombre del archivo que tendrá por defecto al no obtenerse desde
     * el Servlet.
     *
     * • Por defecto: <code>archivo</code>
     *
    
     * @param {string} filename
     * @returns {DownloadManager}
     */
    self.setFilename = function (filename) {
        self.defaultFilename = filename;
        return self;
    };

    /**
     * Especifica solo el nombre del Servlet desde donde se descargará el archivo.
     *
    
     * @param {string} servlet
     * @returns {DownloadManager}
     */
    self.setServlet = function (servlet) {
        if (isNullOrEmpty(servlet)) {
            console.error(`El valor entregado en 'setServlet' es inválido.<br>Valor: ${servlet}`);
            return null;
        }
        self.url = `${context}/${servlet}`;
        return self;
    };

    /**
     * Entrega los parámetros requeridos en el Servlet. (Opcional)
     *
    
     * @param {array} data
     * @returns {DownloadManager}
     */
    self.setData = function (data) {
        self.data = data;
        return self;
    };

    /**
     * Define las acciones que se ejecutarán al obtener un resultado <b>Exitoso</b>
     * desde el Servlet.
     *
    
     * @param {callback} callback
     * @returns {DownloadManager}
     */
    self.onSuccess = function (callback) {
        self.successCallback = callback;
        return self;
    };

    /**
     * Define las acciones que se ejecutarán al obtener un <b>Error</b> en la llamada
     * del Ajax.
     *
    
     * @param {callback} callback
     * @returns {DownloadManager}
     */
    self.onError = function (callback) {
        self.errorCallback = callback;
        return self;
    };

    /**
     * Define las acciones que se ejecutarán <b>Antes</b> de realizar la llamada al Servlet.
     *
    
     * @param {callback} callback
     * @returns {DownloadManager}
     */
    self.beforeSend = function (callback) {
        self.beforeSendCallback = callback;
        return self;
    };

    /**
     * Define las acciones que se ejecutarán al <b>Finalizar</b> la llamada/ejecución del Ajax.
     *
    
     * @param {callback} callback
     * @returns {DownloadManager}
     */
    self.onComplete = function (callback) {
        self.completeCallback = callback;
        return self;
    };

    /**
     * Ejecuta el llamado de Ajax
     *
    
     * @returns {undefined}
     */
    self.execute = function () {
        $.ajax({
            url: self.url,
            type: self.type,
            data: self.data,
            xhrFields: {
                responseType: "blob"
            },
            beforeSend: function (xhr) {
                if (typeof self.beforeSendCallback === 'function') {
                    self.beforeSendCallback(xhr);
                }
            },
            success: function (data, status, xhr) {
                // Procesa la respuesta y descarga el archivo
                downloadFileFromServlet(data, xhr, self.defaultFilename);

                if (typeof self.successCallback === 'function') {
                    self.successCallback(data, status, xhr);
                }
            },
            error: function (xhr) {
                if (typeof self.errorCallback === 'function') {
                    self.errorCallback(xhr);
                }
            },
            complete: function () {
                if (typeof self.completeCallback === 'function') {
                    self.completeCallback();
                }
            }
        });
    };

    return self;
}

/**
 * Placeholder para utilizar en cargas de btotones.
 *

 * @type String
 */
const loading_btn_text = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Espere, por favor...`;


/**
 * Habilita/Deshabilita un elemento por su ID
 *

 * @param {string} input - Identificador del elemento. Puede ser ID o clase con su respectivo prefijo (Ej: "#element-id", ".element-class", etc).
 * @param {boolean} status - true: Habilita | false: Deshabilita
 * @returns {undefined}
 */
function setStatusElement(input, status) {
    if (typeof status !== 'boolean') {
        console.error("Invalid type of variable. Only boolean are allowed.");
        return;
    }
    // Guardar referencia al elemento enfocado actualmente
    var focusedElement = $(document.activeElement);

    // Elemento
    let element = $(`${input}`);

    element.prop("disabled", !status);
    status ? element.removeClass("disabled c-disabled") : element.addClass("disabled c-disabled");

    // Restablecer el foco en el elemento anteriormente enfocado
    if (!status && focusedElement.is(":input, button, a")) {
        return focusedElement.focus();
    }
    return false;
}

/**
 * Habilita/Deshabilita TODOS los elementos de un contenedor
 *

 * @param {string} container - ID, Clase o identificar del contenedor (Ej: "#id-container", ".class-container", etc)
 * @param {boolean} status - true: Habilita | false: Deshabilita
 * @returns {undefined}
 */
function setStatusAllElements(container, status) {
    if (typeof status !== 'boolean') {
        console.error("Invalid type of variable. Only boolean are allowed.");
        return;
    }
    // Guardar referencia al elemento enfocado actualmente
    var focusedElement = $(document.activeElement);

    // Contenedor
    container_element = $(`${container} :input, ${container} button, ${container} a`);

    // Deshabilita las acciones sobre los componentes
    container_element.prop("disabled", !status);
    // Añade/quita clases sobre los componentes
    status ? container_element.removeClass("disabled c-disabled") : container_element.addClass("disabled c-disabled");

    // Restablecer el foco en el elemento anteriormente enfocado
    if (!status && focusedElement.is(":input, button, a")) {
        return focusedElement.focus();
    }
    return false;
}

/**
 * Asignar como propiedad "lenguage" en DataTable para idioma en 'Español'.
 *

 * @returns {getDataTableLanguage_ES.global_customAnonym$14}
 */
function getDataTableLanguage_ES() {
    return {
        "sProcessing": "Cargando...",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "No se encontraron resultados",
        "sInfo": "Mostrando registros del <b>_START_</b> al <b>_END_</b> de un total de <b>_TOTAL_</b> registros",
        "sInfoEmpty": "Mostrando registros del <b>0</b> al <b>0</b> de un total de <b>0</b> registros",
        "sInfoFiltered": "(filtrado de un total de <b>_MAX_</b> registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
//        "sZeroRecords": `   <div>
//                                <img class="avatar avatar-xl mb-3" src="${context}/assets/svg/illustrations/empty-state-no-data.svg" alt="Image Description">
//                                <p class="card-text">Sin resultados</p>
//                            </div>
//                            `,
//        "sEmptyTable": `    <div>
//                                    <img class="avatar avatar-xl mb-3" src="${context}/assets/svg/illustrations/empty-state-no-data.svg" alt="Image Description">
//                                    <p class="card-text">Sin datos que mostrar</p>
//                                </div>
//                                `,
        //"emptyTable": "No se han encontrado datos",
        "sUrl": "",
        "sInfoThousands": ".",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": '<i class="bi-chevron-double-right small"></i>',
            "sPrevious": '<i class="bi-chevron-double-left small"></i>'
        },
        "decimal": ",",
        "thousands": ".",
        "select": {
            "rows": {
                0: "", // Se deja en blanco cuando no hay registros seleccionados
                1: '<span class="badge bg-soft-info text-info"><b>%d</b> registro seleccionado (<label class="c-pointer fw-bold text-highlight-info unselect-all-cf">Deseleccionar</label>)</span>',
                _: '<span class="badge bg-soft-info text-info"><b>%d</b> registros seleccionados (<label class="c-pointer fw-bold text-highlight-info unselect-all-cf">Deseleccionar</label>)</span>' // Todos
            }
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
    };
}

/*
 * Recarga la tabla 'DataTable' conservando la posición de la página y del Scroll.
 *

 * @param {type} id - ID del DataTable
 * @returns {prmise} - resolve(true): Operación correcta y completa
 */
function reloadDataTable(id) {
    return new Promise((resolve, reject) => {
        try {
            if ((typeof id !== 'undefined') && !isDataTable(id)) {
                console.error("The given ID isn't a valid DataTable");
                reject("The given ID isn't a valid DataTable");
                return;
            }

            // Verificar si hay solicitudes Ajax pendientes de ejecución
            //if ($.fn.dataTable.ext.ajax.queued("#" + id)) {
            if ($.active > 0) {
                //console.log("A reload is already in progress");
                //reject("A reload is already in progress");
                //return;
            }

            // Variable que valida si se desea restablecer el paginado o quedarse donde estaba
            // true: Restablece el paginado
            let resetPage = false;
            if (arguments.length > 1) {
                resetPage = Boolean(arguments[1]);
            }

            // Variable que valida si se desea deseleccionar todos los registros
            // true: Desmarca los registros
            let deselectAll = false;
            if (arguments.length > 2) {
                deselectAll = Boolean(arguments[2]);
            }

            // Cerrar todos los tooltips abiertos
            $('[data-bs-toggle="tooltip"]').tooltip("hide");
            // Cerrar todos los popover abiertos
            //$('[data-bs-toggle="popover"]').tooltip("hide");

            // Obtener la tabla DataTable y guardar la información de la página actual
            let table = $(`#${id}`).DataTable();
            let currentPage = table.page();

            // Guardar la posición de desplazamiento actual del elemento contenedor de la tabla
            let container = $(`#${id}_wrapper .dataTables_scrollBody`);
            let scrollTop = container.scrollTop();

            // Verifica si la tabla tiene activa la propiedad "server-side"
            let is_server_side = table.settings()[0].oFeatures.bServerSide;

            // Deseleccionar todos los registros
            if (deselectAll) {
                table.rows().deselect();
                table.columns().checkboxes.deselectAll();
            }

            // Recargar la tabla
            table.ajax.reload(function () {
                // Restaurar la página actual después de que se haya completado la recarga
                if (!resetPage) {
                    if (is_server_side)
                        table.page(currentPage).draw(false);
                    //table.page(currentPage);
                    else
                        table.page(currentPage).draw(false);
                }

                // Volver a la posición de desplazamiento anterior del elemento contenedor de la tabla
                if (!resetPage)
                    container.scrollTop(scrollTop);

                // Reotorna la promesa como resuelta
                resolve(true);
            });

            /*
             // DataTable
             let table = $('#' + id).DataTable();
             // Recargar la tabla
             table.ajax.reload(null, false); // reload(callBack, resetPaging)
             */
        } catch (e) {
            reject("Error en 'reloadDataTable': " + e);
        }
    });
}

/**
 * Verifica si la tabla "DataTable" está inicializada
 *

 * @returns {boolean} true: Es DataTable y está inicializada | false: No es DataTable y/o no está inicializada
 */
function isDataTable(tableID) {
    return $.fn.DataTable.isDataTable(`#${tableID}`);
}

/**
 * Formatea un número añadiendo puntuaciones de milésimas.
 *

 * @param {type} x
 * @returns {unresolved}
 */
function formatNumberThousand(x) {
    var parts = x.toString().split(".");
    var numero = Math.floor(parseFloat(parts[0]));
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Inicializa el conteo con la librería "counter" y lo reinicia si es que ya se había realizado.
 * 

 * @param {string} prefix
 * @returns {undefined}
 */
$.fn.setCounter = function (value, prefix) {
    let $id = this.attr('id');
    let $obj = this.data("counter_up");
    let $value = parseInt(value);

    if ($obj) {
        $obj.update($value);
        return;
    }

    const options = {
        separator: '.',
        decimal: ',',
        prefix: prefix || '',
    };

    $obj = new CountUp($id, $value, options);

    if (!$obj.error) {
        $obj.start();
    } else {
        console.error($obj.error);
    }

    this.data("counter_up", $obj);
};

/**
 * Contrae un elemento "accordion"
 * 

 * @param {type} id
 * @returns {undefined}
 */
function collapseAccordion(id) {
    // Obtén el elemento con el id "accordionPasswordEdit"
    var accordionElement = $(`#${id}`);

    // Encuentra el elemento con la clase "accordion-button" dentro del elemento del accordion
    var accordionButton = accordionElement.find('.accordion-button');

    // Añade la clase "collapsed" al elemento de botón
    accordionButton.addClass('collapsed');

    // Cambia el atributo "aria-expanded" a "false"
    accordionButton.attr('aria-expanded', 'false');

    // Encuentra el elemento con la clase "accordion-collapse" dentro del elemento del accordion
    var accordionCollapse = accordionElement.find('.accordion-collapse');

    // Remueve la clase "show" del elemento de colapso
    accordionCollapse.removeClass('show');
}

/**
 * Al ingresar datos en el campo numérico.
 * Se puede complementar indicando el tipo de campo como "numeric"
 * 

 */
$("body").on("keypress", ".form-control-quantity-counter", function (event) {
    tecla = (document.all) ? event.keyCode : event.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla === 8) {
        return true;
    }
    //Tecla de espaceadora para borrar, siempre la permite
    if (tecla === 32) {
        return true;
    }

    patron = /[0-9]/; //regex que permite solo numeros
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
});

/**
 * Al quitar el "focus" del campo numérico validará el contenido
 * 

 */
$("body").on("blur", ".form-control-quantity-counter", function () {
    var field = $(this);
    var new_val = field.val();
    var min = parseInt(field.attr("min"));
    var max = parseInt(field.attr("max"));

    if (new_val < min) {
        field.val(min);
        return;
    }

    if (new_val > max) {
        field.val(max);
        return;
    }
});

/**
 * Realiza la acción de restar (-) en un campo numérico.
 *

 */
$("body").on("click", ".btn-minus", function () {
    var btn = $(this);
    var id = btn.attr("for");
    var input = $(`#${id}`);
    var max = parseInt(input.attr("max"));
    var min = parseInt(input.attr("min"));
    var val = parseInt(input.val());

    //input.off("blur");
    //input.on("blur", onBlurCounter(input));

    // En caso de ingresar un valor no numérico se estable el mínimo
    if (isNaN(val)) {
        input.val(min).trigger("change");
        return;
    }

    // Si el valor ingresado es igual al mínimo, no deja restar más.
    if (val === min) {
        return;
    }

    if (val > max) {
        val = max;
    }
    input.val(val - 1).trigger("change");
});

/**
 * Realiza la acción de sumar (+) en un campo numérico.
 *

 */
$("body").on("click", ".btn-plus", function () {
    var btn = $(this);
    var id = btn.attr("for");
    var input = $(`#${id}`);
    var max = parseInt(input.attr("max"));
    var min = parseInt(input.attr("min"));
    var val = parseInt(input.val());

    // En caso de ingresar un valor no numérico se estable el mínimo
    if (isNaN(val)) {
        input.val(min).trigger("change");
        return;
    }

    if (val === max) {
        return;
    }

    if (val > max) {
        val = max - 1;
    }
    input.val(val + 1).trigger("change");
});

/**
 * Entra/Sale del modo Pantalla completa
 * 

 * @param {type} elem - Elemento o contenedor que se quiera mostrar específicamente en pantalla completa.
 * @returns {undefined}
 */
function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

/**
 * Retorna un Array con los parámetros de la URL del contexto actual
 * 

 * @returns {unresolved}
 */
function getURLParams() {
    let query = document.location.search;
    let searchParams = new URLSearchParams(query);
    let queryParams = Object.fromEntries(searchParams.entries());
    let queryLocalParams = {};

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        queryParams[key] = value;
    }

    return queryParams;
}

/**
 * Elimina los parámetros específicos de la URL.<br>
 * Si no se entregan argumentos se eliminarán <b>todos</b> los parámetros existentes en le URL.
 * 

 * @param {string} parameters - Parámetros a eliminar de la URL. No entregar parámetros para eliminar todo.
 * @returns {undefined}
 */
function deleteURLParameters(...parameters) {
    var urlParams = new URLSearchParams(window.location.search);

    if (parameters.length === 0) {
        // Si no se proporcionan parámetros, se elimina todo después del signo de interrogación
        var nuevaURL = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, nuevaURL);
    } else {
        // Elimina los parámetros especificados
        parameters.forEach(function (parameter) {
            urlParams.delete(parameter);
        });

        // Reconstruye la URL con los parámetros actualizados
        var nuevaURL = window.location.pathname + (isNullOrEmpty(urlParams) ? '' : `?${urlParams.toString()}`);
        window.history.replaceState({}, document.title, nuevaURL);
    }
}

/**
 * Ingresa a Pantalla completa
 * 

 * @returns {undefined}
 */
function enterFullscreen() {
    elem = document.documentElement;

    if (document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement) {
        return;
    }

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
}

/**
 * Salir de Pantalla completa
 * 

 * @returns {undefined}
 */
function exitFullscreen() {
    try {
        document.exitFullscreen();
    } catch (e) {
    }
}

/**
 * Event listener para el cambio de estado de pantalla completa
 * 

 */
$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function () {
    let nav = $(".nav-item");
    let enter_fs = nav.find(".toggle-enter-fullscreen");
    let exit_fs = nav.find(".toggle-exit-fullscreen");

    // Verifica si la ventana está en modo pantalla completa
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
        // Cambia el icono
        enter_fs.hide();
        exit_fs.show();
    } else {
        // Cambia el icono
        enter_fs.show();
        exit_fs.hide();
    }
});


/**
 * 'Observador' que verifica cuando la vista ha sido redimensionada.
 * Permite ajustar los headers de los DataTables cuando tienen habilitada la opción "scrollX"
 * 

 * @type ResizeObserver
 */
var observer = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (entry) {
        $(entry.target).DataTable().columns.adjust();
    });
}) : null;

/**
 * Función que permite ajustar los headers de los DataTables cuando la vista es redimensionada
 * 

 * @param {type} $table
 * @returns {undefined}
 */
function resizeHandler($table) {
    if (observer)
        observer.observe($table[0]);
};

/**
 * Especifica la cantidad máxima de botones a mostrar en el paginado de una
 * tabla tipo Datatable.
 *

 * @param {String} id - ID de la Tabla (Datatable)
 * @param {Integer} max - Máximo de botones del paginado a mostrar (Mínimo: 5)
 * @returns {undefined}
 */
function setMaxPaginationDatatable(id, max) {
    let min = 5;
    if (max < min) {
        max = min;
    }
    $(`#${id}`).DataTable.ext.pager.numbers_length = max;
}