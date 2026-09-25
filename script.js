    const body = document.body;
    const backButton = document.querySelector("#back-button");
    const homeNav = document.querySelector("#home-nav");
    const entryNav = document.querySelector("#entry-nav");
    const searchInput = document.querySelector("#search-input");
    const homeNavButtons = [...document.querySelectorAll("#home-nav .nav-button")];
    const entryNavButtons = [...document.querySelectorAll(".entry-nav-button")];
    const panelViews = [...document.querySelectorAll(".panel-view")];
    const categoryToggles = [...document.querySelectorAll(".category-toggle")];
    const glossaryButtons = [...document.querySelectorAll(".concept-list .concept-button")];
    const entrySections = [...document.querySelectorAll(".entry-section")];
    const questionButtons = [...document.querySelectorAll(".question-button")];
    const questionAuthorGroups = [...document.querySelectorAll(".question-authors")];
    const authorButtons = [...document.querySelectorAll(".author-button")];
    const introContainer = document.querySelector(".intro");
    const introPane = document.querySelector(".intro-pane");
    let previousView = "categories";
    let isEntryOpen = false;
    let isQuestionOpen = false;
    let isAuthorOpen = false;
    let currentQuestionButton = null;

    const homeContent = {
      kicker: "¿Quién produce el conocimiento?",
      title: "Archivo en disputa",
      copy: "Este glosario reúne conceptos provenientes del pensamiento decolonial y de los estudios críticos del diseño. Invita a cuestionar las categorías heredadas de la modernidad occidental y a reconocer la existencia de múltiples formas de producir, transmitir y validar conocimiento."
    };

    function normalizeText(value) {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
    }

    function activeHomeView() {
      return panelViews.find((view) => !view.hidden && view.id !== "entry-view")?.id.replace("-view", "") || "categories";
    }

    function setEntrySection(name) {
      entrySections.forEach((section) => { section.hidden = section.dataset.entryPanel !== name; });
      entryNavButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.entryView === name)));
    }

    function renderHome() {
      introContainer.innerHTML = `
        <p class="intro-kicker" id="intro-kicker">${homeContent.kicker}</p>
        <h1 id="page-title">${homeContent.title}</h1>
        <p class="intro-copy" id="intro-copy">${homeContent.copy}</p>`;
      body.classList.remove("reading-question");
    }

    function renderRepresentationIntro() {
      introContainer.innerHTML = `
        <h1 id="page-title">Representación</h1>
        <p class="intro-copy" id="intro-copy">La representación es el proceso mediante el cual se producen y circulan imágenes, relatos y significados sobre personas, comunidades y territorios. Nunca es neutral: selecciona qué se vuelve visible, desde qué mirada y bajo qué relaciones de poder.</p>`;
      questionButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      authorButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      isQuestionOpen = false;
      isAuthorOpen = false;
      body.classList.remove("reading-question", "mobile-menu-open");
      introPane.scrollTop = 0;
    }

    function renderRaeEntry() {
      questionButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      authorButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      isQuestionOpen = false;
      isAuthorOpen = false;
      body.classList.remove("mobile-menu-open");
      body.classList.add("reading-question");
      introContainer.innerHTML = `
        <article class="entry-article rae-entry">
          <h1 id="page-title">Representación</h1>
          <p>Del lat. <em>repraesentatio, -ōnis.</em></p>
          <ol>
            <li><strong>f.</strong> Acción y efecto de representar.<p><strong>Sin.:</strong></p><ul><li>función, obra, espectáculo, comedia.</li><li>actuación, interpretación.</li></ul></li>
            <li><strong>f.</strong> Imagen o idea que sustituye a la realidad.<p><strong>Sin.:</strong></p><ul><li>símbolo, encarnación, personificación, imagen, emblema, figura, efigie, idea.</li></ul></li>
            <li><strong>f.</strong> Conjunto de personas que representan a una entidad, colectividad o corporación.<p><strong>Sin.:</strong></p><ul><li>delegación, comisión, comité, embajada, legación, cancillería, consejo.</li></ul></li>
            <li><strong>f.</strong> Cosa que representa otra.</li>
            <li><strong>f.</strong> Categoría o distinción social. <em>Juan es hombre de representación en Madrid.</em></li>
            <li><strong>f.</strong> Obra dramática que en la Edad Media trataba de temas varios, principalmente religiosos.</li>
            <li><strong>f.</strong> <em>Der.</em> Derecho de una persona a ocupar, para la sucesión en una herencia o mayorazgo, el lugar de otra persona difunta.</li>
            <li><strong>f.</strong> <em>Psicol.</em> Imagen o concepto en que se hace presente a la conciencia un objeto exterior o interior.</li>
            <li><strong>f.</strong> desus. Súplica o proposición apoyada en razones o documentos, que se dirige a un príncipe o superior.</li>
          </ol>
          <h2>Representación gráfica</h2>
          <ol><li><strong>f.</strong> <em>Mat.</em> Figura con que se expresa la relación entre diversas magnitudes.</li></ol>
          <h2>Representación mayoritaria</h2>
          <ol><li><strong>f.</strong> Procedimiento electoral por el que se eligen representantes a quienes obtienen mayoría de votos.</li></ol>
          <h2>Representación política</h2>
          <ol><li><strong>f.</strong> <strong>representación</strong> que ejercen los elegidos en votaciones democráticas que no está sometida a mandato imperativo.</li></ol>
          <h2>Representación proporcional</h2>
          <ol><li><strong>f.</strong> Procedimiento electoral que establece una proporción entre el número de votos obtenidos por cada partido o tendencia y el número de sus representantes elegidos.</li></ol>
          <h2>De representación</h2>
          <ol><li><strong>loc. adj.</strong> Dicho de una cosa: Que realza una función o cargo.</li></ol>
          <h2>Sinónimos o afines de «representación»</h2>
          <ul>
            <li>función, obra, espectáculo, comedia.</li>
            <li>actuación, interpretación.</li>
            <li>símbolo, encarnación, personificación, imagen, emblema, figura, efigie, idea.</li>
            <li>delegación, comisión, comité, embajada, legación, cancillería, consejo.</li>
          </ul>
        </article>`;
      introPane.scrollTop = 0;
    }

    function renderQuestion(button, toggleAuthors = true) {
      questionButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const authorGroup = document.querySelector(`[data-authors-for="${button.dataset.question}"]`);
      if (authorGroup) {
        authorGroup.hidden = toggleAuthors ? !authorGroup.hidden : false;
        button.setAttribute("aria-expanded", String(!authorGroup.hidden));
      }
      authorButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
      currentQuestionButton = button;
      isQuestionOpen = true;
      isAuthorOpen = false;
      body.classList.remove("mobile-menu-open");
      body.classList.add("reading-question");

      if (!['representation', 'gaze', 'other', 'legitimacy', 'self', 'speak'].includes(button.dataset.question)) {
        introContainer.innerHTML = `<h1 id="page-title">${button.textContent}</h1>`;
        introPane.scrollTop = 0;
        return;
      }

      if (button.dataset.question === "gaze") {
        introContainer.innerHTML = `
          <article class="entry-article">
            <p>Toda representación presupone una mirada. Hay alguien que observa y algo —o alguien— que aparece ante esa mirada.</p>
            <p>bell hooks desarrolla esta cuestión en <em>The Oppositional Gaze: Black Female Spectators</em>, publicado originalmente en <em>Black Looks: Race and Representation</em>. Allí analiza particularmente la experiencia de espectadoras negras frente al cine estadounidense. Su argumento parte de una historia concreta: dentro de relaciones raciales de dominación, el propio acto de mirar estuvo regulado. Para hooks, por eso, mirar puede adquirir una dimensión política.</p>
            <p>Frente a un sistema visual que producía determinadas imágenes de las personas negras, hooks identifica la posibilidad de una mirada que no acepta pasivamente aquello que ve. Es lo que denomina <strong>oppositional gaze</strong>, o mirada opositora.</p>
            <p>En el ensayo escribe:</p>
            <blockquote>“It was the oppositional black gaze that responded to these looking relations.”</blockquote>
            <p>La importancia de esta idea está en que el espectador deja de ser entendido como alguien que simplemente recibe el significado preparado por una imagen. Puede reconocer sus códigos, discutirlos, rechazarlos o leerlos de otra manera.</p>
            <p>hooks explica que espectadores negros podían observar críticamente las representaciones dominantes y desarrollar formas de <strong>critical spectatorship</strong>, una espectatorialidad crítica. También señala que las mujeres negras se encontraban en una posición particular porque las imágenes disponibles podían no representarlas en absoluto o hacerlo dentro de categorías construidas por una mirada racializada y patriarcal.</p>
            <p>Esto introduce una diferencia fundamental entre <strong>estar visible</strong> y <strong>tener agencia visual</strong>. Una persona puede aparecer constantemente en imágenes y aun así no controlar cómo es mostrada.</p>
            <h2>Desde el diseño</h2>
            <p>En diseño gráfico, interfaces, fotografía editorial o comunicación audiovisual, solemos pensar mucho en aquello que el usuario mira y menos en <strong>desde dónde lo estamos haciendo mirar</strong>.</p>
            <p>Pero toda composición establece una posición para el observador.</p>
            <p class="display-lines"><span>El encuadre decide qué puede verse.</span><span>La escala establece qué resulta dominante.</span><span>La secuencia establece qué vemos primero.</span><span>La interacción determina qué puede descubrirse y qué permanece oculto.</span></p>
            <p>Por eso, aplicar la idea de hooks al diseño no significa simplemente producir imágenes “más inclusivas”. También significa cuestionar la relación aparentemente unilateral:</p>
            <p><strong>DISEÑADOR → IMAGEN → ESPECTADOR</strong></p>
            <p>Una perspectiva decolonial permite imaginar una relación menos cerrada, en la cual el espectador pueda confrontar, reinterpretar e incluso intervenir en aquello que se le presenta.</p>
            <p>En tu página, por ejemplo, esto podría convertirse literalmente en una operación de interfaz: una representación puede aparecer inicialmente de una manera y cambiar cuando el usuario decide <strong>“mirar de vuelta”</strong>. Así la mirada opositora dejaría de ser únicamente contenido escrito y se convertiría en funcionamiento.</p>
            <p>La pregunta entonces sería:</p>
            <p><strong>¿La interfaz solo permite mirar o también permite cuestionar la mirada que propone?</strong></p>
          </article>`;
        introPane.scrollTop = 0;
        return;
      }

      if (button.dataset.question === "speak") {
        introContainer.innerHTML = `
          <article class="entry-article">
            <p>Esta pregunta lleva el problema de la representación directamente al corazón de la disciplina.</p>
            <p>Gran parte del diseño moderno se desarrolló alrededor de una figura particular: un diseñador capaz de observar un problema, analizarlo y producir una solución.</p>
            <p>La dificultad aparece cuando aquello que se define como “problema” pertenece a la vida de otras personas. ¿Quién decidió que algo era un problema? ¿Para quién lo es? ¿Quién estableció qué significa solucionarlo?</p>
            <p>Arturo Escobar cuestiona profundamente la universalidad de muchos modelos modernos de diseño en <em>Designs for the Pluriverse</em>. Su argumento parte de entender que diseñar no significa simplemente producir objetos: el diseño participa en la producción de formas de vivir.</p>
            <p>Escobar escribe que:</p>
            <blockquote>“Design is ontological in that all design-led objects, tools, and even services bring about particular ways of being.”</blockquote>
            <p>Es decir, todo diseño favorece determinadas maneras de hacer, conocer y relacionarnos con el mundo.</p>
            <p>Una aplicación, por ejemplo, no solamente organiza información. También puede definir qué conductas son posibles, qué acciones tienen valor y qué relaciones entre usuarios se vuelven normales.</p>
            <p>Por eso Escobar propone reorientar el diseño hacia aproximaciones <strong>relacionales, situadas y vinculadas con la autonomía de las comunidades</strong>. En el libro pregunta explícitamente si el diseño puede contribuir a fortalecer las formas comunitarias de autonomía y los proyectos de vida definidos por comunidades movilizadas en América Latina.</p>
            <p>Esta idea se conecta con su concepto de <strong>pluriverso</strong>: frente a la pretensión de construir un único modelo universal de desarrollo, conocimiento o existencia, propone pensar un mundo donde puedan coexistir múltiples maneras de producir realidad.</p>
            <p>Esto no significa relativismo absoluto ni simplemente “celebrar la diversidad”. Implica reconocer que aquello que una tradición presenta como universal puede ser, en realidad, una forma cultural particular que consiguió establecerse como norma.</p>
            <hr>
            <h2>Desde el diseño</h2>
            <p>El <strong>Decolonising Design Collective</strong>, del que participaron Ahmed Ansari, Danah Abdulla, Ece Canlı, Mahmoud Keshavarz, Matthew Kiem, Pedro Oliveira, Luiza Prado y Tristan Schultz, plantea este problema dentro de la propia disciplina.</p>
            <p>Su manifiesto sostiene que buena parte del discurso dominante del diseño ha privilegiado formas eurocéntricas y anglocéntricas de ver, conocer y actuar, mientras otras tradiciones y conocimientos han ocupado posiciones marginales.</p>
            <p>Una frase particularmente importante del manifiesto es:</p>
            <blockquote>“Our goal is ontological rather than additive change.”</blockquote>
            <p><strong>El objetivo es un cambio ontológico, no simplemente aditivo.</strong></p>
            <p>Esta diferencia es clave.</p>
            <p>Una transformación <strong>aditiva</strong> sería:</p>
            <p>“Tenemos un sistema de diseño occidental; agreguemos más autores indígenas, africanos, asiáticos y latinoamericanos.”</p>
            <p>El manifiesto propone ir más lejos:</p>
            <p class="display-lines"><span><strong>¿Por qué ese sistema es el punto de partida?</strong></span><span><strong>¿Quién decidió qué cuenta como diseño?</strong></span><span><strong>¿Por qué determinadas metodologías son consideradas universales?</strong></span></p>
            <p>El colectivo aclara precisamente que aumentar la diversidad de personas dentro de instituciones existentes no transforma necesariamente las estructuras que produjeron esa exclusión.</p>
            <hr>
            <p>Entonces, ¿puede el diseño hablar por otros?</p>
            <p>Desde estos planteos, quizá la pregunta más productiva no sea responder simplemente <strong>sí</strong> o <strong>no</strong>.</p>
            <p>La cuestión sería preguntarse <strong>qué relación establece el diseñador con aquellas personas cuyas experiencias intenta comunicar</strong>.</p>
            <p>Hay una diferencia enorme entre:</p>
            <p><strong>diseñar SOBRE alguien</strong></p>
            <p>y</p>
            <p><strong>diseñar CON alguien</strong>.</p>
            <p>Y todavía aparece una tercera posibilidad:</p>
            <p><strong>crear las condiciones para que esa persona pueda diseñar o representarse por sí misma.</strong></p>
            <p>Ese desplazamiento sintetiza bastante bien la relación entre representación y diseño decolonial.</p>
            <p>El diseñador deja de preguntarse únicamente:</p>
            <p><strong>“¿Cómo puedo representar correctamente a esta comunidad?”</strong></p>
            <p>y empieza a preguntarse:</p>
            <p><strong>“¿Por qué soy yo quien tiene que decidir cómo esta comunidad será representada?”</strong></p>
          </article>`;
        introPane.scrollTop = 0;
        return;
      }

      if (button.dataset.question === "self") {
        introContainer.innerHTML = `
          <article class="entry-article">
            <p>La posibilidad de autorrepresentarse modifica profundamente las relaciones de representación.</p>
            <p>Adolfo Albán Achinte resulta especialmente importante para esta pregunta porque trabaja directamente sobre creación, colonialidad, pueblos indígenas y afrodescendientes en América Latina.</p>
            <p>En <em>Pedagogías de la re-existencia</em>, Albán describe cómo los sistemas coloniales construyeron representaciones sobre otras poblaciones desde la perspectiva del colonizador y, al mismo tiempo, limitaron la posibilidad de que esas poblaciones produjeran sus propias representaciones.</p>
            <p>Posteriormente propone pensar determinadas prácticas creativas como procesos de <strong>auto-representación, auto-resignificación y construcción de nuevas simbologías</strong>. Según su planteo, estas prácticas pueden hacer visible una pluralidad de existencias que las narrativas dominantes habían reducido o silenciado.</p>
            <p>Este planteo se relaciona con uno de sus conceptos más importantes: <strong>re-existencia</strong>.</p>
            <p>Albán la define como prácticas mediante las cuales las comunidades crean maneras de continuar construyendo la vida frente a estructuras que históricamente las han inferiorizado o invisibilizado. No se trata solamente de resistir aquello impuesto desde afuera, sino de recuperar y producir formas propias de existencia.</p>
            <p>Lo sintetiza mediante una pregunta que recoge del líder comunitario Héctor Daniel Useche:</p>
            <blockquote>“¿Qué nos vamos a inventar hoy para seguir viviendo?”</blockquote>
            <p>Esta frase permite entender una diferencia fundamental entre <strong>resistencia</strong> y <strong>re-existencia</strong>.</p>
            <p>La resistencia parte de aquello contra lo cual uno lucha.</p>
            <p>La re-existencia también pregunta <strong>qué otras formas de vida pueden producirse</strong>.</p>
            <p>Por eso la autorrepresentación no consiste simplemente en corregir una imagen incorrecta.</p>
            <p>No sería:</p>
            <p class="display-lines"><span><strong>ANTES:</strong> una representación negativa.</span><span><strong>DESPUÉS:</strong> una representación positiva.</span></p>
            <p>La transformación es más profunda: cambia <strong>quién dispone de la capacidad de producir significado</strong>.</p>
            <h2>Desde el diseño</h2>
            <p>Para el diseño decolonial, esta diferencia es esencial.</p>
            <p>Supongamos que un estudio recibe el encargo de desarrollar la identidad visual de una comunidad cultural.</p>
            <p>Una primera estrategia podría consistir en investigar cuidadosamente esa cultura y representarla con respeto.</p>
            <p>Una segunda estrategia introduce otra pregunta:</p>
            <p><strong>¿por qué el diseñador debería tener la autoridad exclusiva para decidir cómo será representada esa comunidad?</strong></p>
            <p>Esto modifica el rol profesional.</p>
            <p>El diseñador puede pasar de ser:</p>
            <p><strong>AUTOR → que interpreta una comunidad</strong></p>
            <p>a convertirse en:</p>
            <p><strong>FACILITADOR / COLABORADOR → que construye herramientas junto con ella.</strong></p>
            <p>Esto no elimina necesariamente al diseñador, pero distribuye de otra manera la capacidad de decisión.</p>
            <p>La autorrepresentación también cuestiona algo que ocurre mucho en diseño: utilizar imágenes, símbolos o lenguajes visuales de una comunidad únicamente porque poseen una determinada potencia estética, separándolos del contexto en el que fueron producidos.</p>
            <p>Desde una perspectiva de re-existencia, lo importante no es solamente <strong>qué símbolo aparece</strong>, sino quién puede decidir qué significa, cómo circula y para qué se utiliza.</p>
          </article>`;
        introPane.scrollTop = 0;
        return;
      }

      if (button.dataset.question === "legitimacy") {
        introContainer.innerHTML = `
          <article class="entry-article">
            <p>No todas las imágenes tienen las mismas posibilidades de ser vistas.</p>
            <p class="display-lines"><span>Algunas ingresan a museos.</span><span>Algunas se conservan en archivos.</span><span>Algunas aparecen en libros de historia.</span><span>Algunas son incorporadas a programas universitarios.</span></p>
            <p>Otras quedan fuera de esos espacios.</p>
            <p>Por eso la representación no depende solamente de quién produce una imagen, sino también de <strong>qué instituciones tienen capacidad para conservarla, clasificarla, exhibirla y otorgarle legitimidad</strong>.</p>
            <p>Rolando Vázquez analiza este problema desde la <strong>aesthesis decolonial</strong>. Su trabajo cuestiona la pretendida universalidad de ciertas categorías modernas de arte y estética y examina cómo museos y otras instituciones participan en la construcción de regímenes de visibilidad.</p>
            <p>En una entrevista dedicada específicamente al museo y la aesthesis decolonial formula unas preguntas casi perfectas para tu entrada:</p>
            <blockquote>“Who is looking and who is being seen? Who is being represented and who is representing?”</blockquote>
            <p>¿Quién mira y quién está siendo visto? ¿Quién es representado y quién representa?</p>
            <p>Para Vázquez, una intervención decolonial en el museo no debería limitarse a agregar nuevos objetos dentro de un sistema que permanece intacto. También puede implicar modificar el modo en que la institución narra, clasifica y contextualiza sus colecciones. Habla incluso de hacer que el museo pueda “hablar de otra manera”, utilizando sus propios archivos para producir narrativas diferentes de aquellas que históricamente organizó.</p>
            <p>Este planteo se conecta directamente con una cuestión central de la decolonialidad: <strong>no basta con incorporar diferencias si la estructura que define cómo deben ser interpretadas continúa siendo la misma</strong>.</p>
            <p>El problema no es únicamente ausencia/presencia.</p>
            <p>También es <strong>clasificación</strong>.</p>
            <h2>Desde el diseño</h2>
            <p>Esto tiene una traducción directa al diseño de información.</p>
            <p>Una interfaz también es una institución de clasificación en miniatura.</p>
            <p class="display-lines"><span>Cuando diseñamos una página definimos:</span><span>qué aparece primero,</span><span>qué recibe un título grande,</span><span>qué pertenece a una categoría,</span><span>qué puede filtrarse,</span><span>qué información se relaciona con otra,</span><span>qué aparece como principal y qué aparece como secundario.</span></p>
            <p>Incluso un glosario, como el que estás diseñando, <strong>no es una estructura neutral</strong>.</p>
            <p>El orden alfabético parece objetivo, por ejemplo, pero produce una forma determinada de recorrer el conocimiento. Una clasificación temática produciría otra. Una red de relaciones produciría otra completamente diferente.</p>
            <p>Desde esta perspectiva, diseño decolonial puede significar también cuestionar <strong>la arquitectura de información</strong>, no solamente las imágenes.</p>
            <p>La pregunta podría transformarse entonces en:</p>
            <p><strong>¿Quién diseñó el sistema que decide qué puede verse, cómo se clasifica y con qué otras cosas se relaciona?</strong></p>
          </article>`;
        introPane.scrollTop = 0;
        return;
      }

      if (button.dataset.question === "other") {
        introContainer.innerHTML = `
          <article class="entry-article">
            <p>Una de las operaciones centrales de la representación consiste en construir diferencias.</p>
            <p>Stuart Hall explica que las sociedades producen categorías mediante las cuales distinguen aquello considerado familiar de aquello considerado diferente. Esas diferencias no son necesariamente problemáticas en sí mismas: necesitamos categorías para producir significado. El problema aparece cuando determinadas diferencias son reducidas, exageradas y transformadas en límites aparentemente naturales entre grupos.</p>
            <p>Ahí aparece el estereotipo.</p>
            <p>Hall distingue el proceso ordinario de construir tipos o categorías del proceso de <strong>estereotipar</strong>. El estereotipo toma unas pocas características, las exagera y las presenta como si describieran la totalidad de una persona o comunidad. Después establece una separación entre aquello que se considera normal y aquello que se define como diferente, desviado o extraño.</p>
            <p>La construcción del “otro” tiene entonces una doble operación:</p>
            <p><strong>construye una imagen de ellos y, simultáneamente, ayuda a construir una imagen de nosotros.</strong></p>
            <p>Adolfo Albán Achinte conecta directamente esta operación con la experiencia colonial latinoamericana. Describe cómo las jerarquías coloniales organizaron poblaciones, temporalidades y culturas mediante sistemas de clasificación. En su análisis, determinados pueblos fueron colocados simbólicamente en un “antes”, como si pertenecieran a una etapa anterior de la historia, mientras la modernidad europea se presentaba como el futuro hacia el cual todos debían avanzar.</p>
            <p>Esto resulta fundamental para comprender la representación colonial: el “otro” puede ser presentado no solamente como <strong>diferente</strong>, sino también como <strong>atrasado, primitivo, exótico o incompleto</strong>.</p>
            <p>Ese mecanismo todavía puede aparecer en representaciones contemporáneas cuando ciertas culturas son mostradas principalmente mediante imágenes de tradición, artesanía, ritualidad o naturaleza, mientras otras aparecen asociadas con tecnología, innovación, contemporaneidad y futuro.</p>
            <h2>Desde el diseño</h2>
            <p>Acá aparece un problema particularmente interesante para el diseño.</p>
            <p>Imaginemos una publicación que quiere representar América Latina y utiliza sistemáticamente:</p>
            <p>texturas artesanales, paletas “tierra”, motivos indígenas, vegetación tropical, imágenes rurales y ornamentaciones consideradas “étnicas”.</p>
            <p>Ningún elemento aislado es necesariamente problemático. El problema surge cuando <strong>esa combinación se convierte en el único lenguaje disponible para representar una región extremadamente diversa</strong>.</p>
            <p>El diseño puede terminar produciendo una equivalencia:</p>
            <p><strong>LATINOAMÉRICA = TRADICIÓN = PASADO = ARTESANÍA = NATURALEZA</strong></p>
            <p>mientras otra equivalencia permanece implícita:</p>
            <p><strong>EUROPA / NORTE GLOBAL = MODERNIDAD = TECNOLOGÍA = FUTURO = DISEÑO</strong></p>
            <p>Ahí la colonialidad no está necesariamente en una frase explícitamente discriminatoria. Puede encontrarse en la propia organización visual de las categorías.</p>
            <p>Por eso una perspectiva decolonial no propone eliminar las diferencias visuales, sino evitar que se conviertan en <strong>esencias</strong>.</p>
            <p>La pregunta para quien diseña sería:</p>
            <p><strong>¿Estoy mostrando una diferencia o estoy convirtiéndola en la única manera posible de entender a esa persona o cultura?</strong></p>
          </article>`;
        introPane.scrollTop = 0;
        return;
      }

      introContainer.innerHTML = `
        <article class="entry-article">
          <p>Representar parece, en principio, una acción sencilla: producir una imagen, un relato o una descripción de algo que ya existe. Sin embargo, Stuart Hall propone entender la representación de una manera mucho más compleja. Para él, las imágenes y los discursos no se limitan a reflejar una realidad anterior: intervienen activamente en la construcción de los significados mediante los cuales comprendemos esa realidad. Esto quiere decir que cuando representamos una persona, una cultura o una comunidad, también seleccionamos qué aspectos de ella se vuelven visibles, cuáles se dejan afuera y mediante qué categorías serán interpretados.</p>
          <p>Esta selección nunca sucede en un vacío cultural. Las imágenes que producimos se relacionan con otras imágenes, relatos y clasificaciones que ya circulan socialmente. Por eso una fotografía, una ilustración o una pieza de diseño puede reforzar significados que existen desde mucho antes de que el diseñador intervenga. Hall analiza esto especialmente en relación con las representaciones racializadas y con la producción de la diferencia. Su preocupación no es solamente que determinadas imágenes puedan ser ofensivas o inexactas, sino que la repetición de ciertos códigos puede transformar construcciones históricas en características que parecen naturales.</p>
          <p>Al analizar el estereotipo, Hall escribe:</p>
          <blockquote>“Stereotyping reduces people to a few, simple, essential characteristics, which are represented as fixed by Nature.”</blockquote>
          <p>Es decir: el estereotipo <strong>reduce a las personas a unas pocas características simples y las presenta como si fueran naturales e inmutables</strong>. Para Hall, esta simplificación está vinculada con relaciones de poder: quienes tienen mayor capacidad para producir y hacer circular representaciones tienen también mayor capacidad para establecer las categorías mediante las cuales otros serán vistos.</p>
          <p>Desde una perspectiva decolonial, esta cuestión se vuelve especialmente importante porque la colonización no se limitó a ocupar territorios. También produjo sistemas de clasificación y representación. Adolfo Albán Achinte describe de manera muy gráfica este proceso cuando habla de poblaciones representadas desde “la retina” del colonizador. Señala que se configuró un sistema donde el sujeto colonizado podía ser representado desde afuera al mismo tiempo que encontraba obstaculizada la posibilidad de representarse a sí mismo.</p>
          <h2>Desde el diseño</h2>
          <p>Para el diseño gráfico, esta discusión obliga a abandonar la idea de que el diseñador es solamente un intermediario neutral entre información y público. <strong>Elegir una fotografía en lugar de otra, establecer una jerarquía, recortar una imagen, crear un pictograma, elegir una tipografía o decidir qué información merece destacarse también son actos de representación.</strong></p>
          <p>El problema decolonial no se resuelve simplemente incorporando imágenes de grupos anteriormente ausentes. También importa preguntarse <strong>quién tomó esas imágenes, quién escribió los textos, quién estableció las categorías y quién tiene control sobre la forma final de la representación</strong>.</p>
          <p>Por eso, frente a una pieza de diseño, podríamos incorporar una serie de preguntas:</p>
          <p><strong>¿Quién aparece? ¿Quién queda afuera? ¿Quién construyó esta imagen? ¿Desde qué lugar? ¿Qué características decidió volver visibles? ¿La persona representada tuvo alguna capacidad para intervenir en esa construcción?</strong></p>
          <p>El diseño decolonial desplaza así la pregunta de <strong>“¿está bien representado?”</strong> hacia otra más estructural: <strong>“¿cómo se distribuye el poder de representar?”</strong></p>
        </article>`;
      introPane.scrollTop = 0;
    }

    const authorProfiles = {
      "stuart-hall": {
        name: "Stuart Hall",
        text: `<p>Stuart Hall fue un teórico cultural jamaiquino-británico y una figura central de los estudios culturales. Su aporte resulta decisivo porque desplaza la representación de la idea de copia: representar no es reflejar pasivamente un mundo ya dado, sino producir significado mediante lenguajes, imágenes, categorías y discursos compartidos.</p>
          <p>Desde esta perspectiva, las cosas no poseen un significado único que la imagen simplemente transporta. El sentido se construye dentro de sistemas culturales de representación. Una fotografía, una noticia o una pieza gráfica relacionan lo que muestran con códigos previos que permiten reconocerlo y clasificarlo. Por eso, para Hall, la representación es una práctica activa y política.</p>
          <h2>Representación, diferencia y poder</h2>
          <p>Hall estudia especialmente cómo la diferencia racial y cultural se vuelve visible. El estereotipo reduce a una persona o grupo a unas pocas características, las fija como si fueran naturales y establece una frontera entre lo considerado normal y aquello marcado como otro. Esa fijación no es inocente: está ligada al poder de definir, clasificar y hacer circular imágenes.</p>
          <p>Sin embargo, el significado nunca queda completamente cerrado. Las imágenes pueden ser discutidas, reapropiadas y leídas desde posiciones diferentes. Esta apertura permite pensar la representación como un terreno de disputa: cambiar una imagen importa, pero también importa transformar los códigos y las relaciones de poder que hacen que esa imagen resulte comprensible.</p>
          <p>Para el diseño, su perspectiva exige preguntar qué significados produce una decisión visual, qué diferencias naturaliza y qué posición ofrece al público, en lugar de evaluar solamente si una imagen se parece fielmente a su referente.</p>
          <p class="reference-note"><strong>Referencia principal:</strong> <em>Representation: Cultural Representations and Signifying Practices</em> (1997), especialmente “The Work of Representation” y “The Spectacle of the Other”.</p>`
      },
      "adolfo-alban-achinte": {
        name: "Adolfo Albán Achinte",
        text: `<p>Adolfo Albán Achinte es artista, investigador y pensador colombiano vinculado a los estudios decoloniales, la interculturalidad crítica y los procesos culturales de comunidades afrodescendientes e indígenas. Su trabajo examina cómo la colonialidad no solo ocupó territorios: también ordenó el tiempo, la sensibilidad y las posibilidades de aparecer ante los demás.</p>
          <p>En sus análisis, los pueblos colonizados fueron representados desde la mirada del colonizador y ubicados en un pasado inmóvil: lo indígena y lo afro aparecían como primitivo, folclórico o anterior a la modernidad. Al mismo tiempo, se restringía su capacidad de producir imágenes y relatos propios. La representación colonial funciona así como una operación doble: habla sobre otros y les dificulta hablar desde sí mismos.</p>
          <h2>Re-existencia y autorrepresentación</h2>
          <p>Albán Achinte propone la noción de <strong>re-existencia</strong> para nombrar las prácticas mediante las cuales las comunidades inventan cotidianamente formas de vivir, crear y dignificar la existencia frente a estructuras que las inferiorizan. No se trata únicamente de oponerse a una imagen negativa, sino de recuperar memorias, construir simbologías y sostener mundos propios.</p>
          <p>Su perspectiva modifica la pregunta por una representación correcta. El problema no termina cuando una institución o un diseñador incluye imágenes más respetuosas: también hay que observar quién controla el proceso, quién establece los códigos y si las personas representadas pueden intervenir en el sentido y la circulación de esas imágenes.</p>
          <p>En diseño, esto orienta el trabajo hacia la colaboración y la autorrepresentación. El diseñador deja de ser quien traduce unilateralmente a una comunidad y puede convertirse en alguien que facilita herramientas para que esa comunidad produzca y gobierne sus propias formas de aparecer.</p>
          <p class="reference-note"><strong>Referencia principal:</strong> “Pedagogías de la re-existencia. Artistas indígenas y afrocolombianos”, en <em>Pedagogías decoloniales</em>.</p>`
      },
      "bell-hooks": {
        name: "bell hooks",
        text: `<p>bell hooks fue una escritora, crítica cultural y teórica feminista estadounidense. En <em>Black Looks: Race and Representation</em> estudia cómo las imágenes participan en relaciones entre raza, género y poder, y cómo las personas negras, especialmente las mujeres negras, han sido excluidas o construidas por una mirada dominante.</p>
          <p>Su ensayo “The Oppositional Gaze” parte de una historia en la que mirar no era un gesto neutral: dentro de la supremacía blanca, incluso el derecho de las personas negras a mirar podía ser castigado. Desde esa experiencia, hooks entiende la mirada como una práctica política capaz de interrogar lo que una imagen pretende imponer.</p>
          <h2>La mirada opositora</h2>
          <p>La <strong>mirada opositora</strong> describe una forma crítica de espectatorialidad. Quien observa no recibe pasivamente el sentido preparado por el cine o los medios: puede reconocer sus códigos, rechazar identificaciones impuestas y leer la imagen a contrapelo. La ausencia y la representación estereotipada de las mujeres negras pueden convertirse así en objetos de análisis y resistencia.</p>
          <p>hooks distingue implícitamente entre aparecer en una imagen y tener agencia sobre ella. La visibilidad no garantiza que una persona controle cómo es vista. Por eso su pensamiento invita a estudiar tanto lo representado como la posición desde la cual se mira y el tipo de espectador que una obra imagina.</p>
          <p>En una interfaz o pieza gráfica, esta perspectiva permite preguntar si el público solo puede aceptar el recorrido propuesto o si dispone de recursos para comparar, discutir, reinterpretar y devolver la mirada.</p>
          <p class="reference-note"><strong>Referencia principal:</strong> “The Oppositional Gaze: Black Female Spectators”, en <em>Black Looks: Race and Representation</em> (1992).</p>`
      },
      "rolando-vazquez": {
        name: "Rolando Vázquez",
        text: `<p>Rolando Vázquez es un sociólogo y pensador decolonial mexicano cuyo trabajo estudia la relación entre modernidad, colonialidad, estética, museos y memoria. Para él, la representación moderna no es solo una técnica para mostrar el mundo: forma parte de un orden que determina quién puede mirar, quién queda convertido en objeto visible y qué experiencias reciben legitimidad.</p>
          <p>Vázquez sostiene que el museo no es una institución neutral. Al seleccionar, clasificar y narrar sus colecciones, establece cánones estéticos y epistemológicos. Históricamente, el sujeto autorizado para mirar y producir sentido fue presentado como universal, mientras los pueblos situados del otro lado de la diferencia colonial fueron observados, clasificados y exhibidos.</p>
          <h2>De la representación a la escucha</h2>
          <p>Su concepto de <strong>aesthesis decolonial</strong> cuestiona el dominio de una estética moderna centrada en la visión y en la apropiación del mundo como imagen. Frente a una mirada única que ordena todo desde su propia perspectiva, Vázquez propone recuperar una pluralidad de experiencias sensibles, memorias y formas de relación que fueron silenciadas.</p>
          <p>Esto no se resuelve agregando objetos diferentes a un museo intacto. También hay que transformar las narraciones, las clasificaciones y la posición del espectador. De ahí su interés por la escucha: recibir otros mundos sin reducirlos inmediatamente a objetos dentro del sistema propio de representación.</p>
          <p>Aplicado al diseño, su planteo obliga a revisar la arquitectura de información: qué se conserva, qué aparece primero, quién nombra las categorías y qué relaciones quedan fuera del sistema.</p>
          <p class="reference-note"><strong>Referencias principales:</strong> <em>Vistas of Modernity</em> y la entrevista “Decolonial Aesthesis and the Museum”.</p>`
      },
      "hector-daniel-useche": {
        name: "Héctor Daniel Useche",
        text: `<p>Héctor Daniel Useche Berón, conocido como “Pájaro”, fue un líder comunitario colombiano de Bugalagrande, asesinado en 1986. Su presencia en esta entrada no corresponde a una teoría académica sistemática sobre la representación, sino a una pregunta recuperada por Adolfo Albán Achinte: <strong>“¿Qué nos vamos a inventar hoy para seguir viviendo?”</strong></p>
          <p>Albán Achinte toma esa formulación como una clave para pensar la re-existencia. La frase desplaza la atención desde la identidad fijada por quien representa hacia la capacidad cotidiana de una comunidad para crear modos de vida bajo condiciones adversas. No pregunta cómo será descrita desde afuera, sino qué puede inventar desde su propia experiencia.</p>
          <h2>Una palabra situada</h2>
          <p>En relación con la representación, Useche permite reconocer que el conocimiento no proviene únicamente de libros, universidades o autores consagrados. Una expresión producida en una experiencia comunitaria puede condensar una perspectiva política y orientar elaboraciones conceptuales posteriores.</p>
          <p>Su inclusión también exige cuidado: no conviene convertirlo retrospectivamente en un teórico de la representación ni separar su frase del contexto comunitario en que fue pronunciada. Su aporte aquí es una palabra situada sobre la invención de la vida, retomada explícitamente por Albán Achinte.</p>
          <p>Para el diseño, esa pregunta invita a no tratar a las comunidades como material visual o como destinatarias pasivas, sino como productoras de decisiones, símbolos y futuros.</p>
          <p class="reference-note"><strong>Referencia:</strong> la formulación es recogida por Adolfo Albán Achinte en su desarrollo del concepto de re-existencia.</p>`
      },
      "arturo-escobar": {
        name: "Arturo Escobar",
        text: `<p>Arturo Escobar es un antropólogo colombiano que estudia críticamente el desarrollo, la modernidad y el diseño. En <em>Designs for the Pluriverse</em> sostiene que diseñar no consiste solamente en producir objetos o resolver problemas: todo diseño contribuye a hacer mundos porque habilita ciertas prácticas, relaciones y formas de existencia mientras dificulta otras.</p>
          <p>Esta dimensión ontológica vuelve política a la representación. Una interfaz, un mapa o una identidad visual no solo describen una realidad: organizan qué entidades cuentan, cómo pueden relacionarse y qué futuro parece posible. Cuando un método se presenta como universal, puede imponer una ontología particular y borrar maneras diferentes de habitar y conocer.</p>
          <h2>Autonomía y pluriverso</h2>
          <p>Escobar propone orientar el diseño hacia la autonomía, la interdependencia y prácticas situadas construidas con comunidades. El <strong>pluriverso</strong> nombra un mundo en el que caben muchos mundos, frente a la pretensión moderna de una única forma válida de progreso, conocimiento y diseño.</p>
          <p>Por eso representar a otros no debería ser una operación externa en la que el diseñador define el problema y ofrece la solución. La cuestión central es si el proceso fortalece la capacidad de una comunidad para decidir sobre su propia vida y sostener los mundos que considera valiosos.</p>
          <p>Desde esta perspectiva, diseñar con otros implica redistribuir autoridad: reconocer conocimientos locales, negociar categorías y permitir que quienes vivirán con el resultado participen en la definición de aquello que el diseño hace visible y posible.</p>
          <p class="reference-note"><strong>Referencia principal:</strong> <em>Designs for the Pluriverse: Radical Interdependence, Autonomy, and the Making of Worlds</em> (2018).</p>`
      }
    };

    const collectiveMembers = new Set([
      "ahmed-ansari", "danah-abdulla", "ece-canli", "mahmoud-keshavarz",
      "matthew-kiem", "pedro-oliveira", "luiza-prado", "tristan-schultz"
    ]);

    function collectiveProfile(name) {
      return `<p>${name} integra el grupo fundador de <strong>Decolonising Design</strong> y es coautor o coautora de <em>A Manifesto for Decolonising Design</em>. La perspectiva presentada aquí es la posición elaborada colectivamente en ese manifiesto; el texto no distribuye cada afirmación entre sus integrantes de manera individual.</p>
        <p>El colectivo parte de una crítica al discurso dominante del diseño: sus teorías, pedagogías y prácticas han privilegiado modos eurocéntricos y anglocéntricos de conocer, hacer y valorar. Esa estructura define quién aparece como diseñador, qué objetos cuentan como diseño y qué conocimientos quedan reducidos a inspiración, artesanía o materia disponible para ser apropiada.</p>
        <h2>Un cambio ontológico</h2>
        <p>Su planteo no se limita a diversificar las imágenes producidas por un sistema intacto. Decolonizar el diseño supone cuestionar las condiciones que autorizan ciertas representaciones y vuelven marginales otras. Por eso el colectivo propone un cambio ontológico y no meramente aditivo: transformar los marcos desde los cuales el diseño comprende el mundo, no solo sumar nuevos contenidos al canon.</p>
        <p>En términos de representación, esto implica revisar quién tiene derecho a hablar, quién es convertido en objeto de estudio y qué saberes se consideran legítimos. Una pieza puede incluir cuerpos e identidades antes ausentes y aun así conservar la misma distribución colonial de autoridad si las categorías, métodos y decisiones siguen bajo el control de las instituciones dominantes.</p>
        <p>Para la práctica, esta perspectiva invita a trabajar desde los bordes del campo, conectar conocimientos que la disciplina separó y construir relaciones donde las personas afectadas puedan intervenir en la producción del sentido, no solo aparecer en el resultado.</p>
        <p class="reference-note"><strong>Referencia principal:</strong> Decolonising Design Collective, <em>A Manifesto for Decolonising Design</em> (2016; publicación académica de 2019).</p>`;
    }

    function renderAuthor(button) {
      const authorId = button.dataset.author;
      const authorName = button.textContent.trim();
      const relatedQuestions = questionButtons.filter((question) => {
        const group = document.querySelector(`[data-authors-for="${question.dataset.question}"]`);
        return group?.querySelector(`[data-author="${authorId}"]`);
      });

      authorButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item.dataset.author === authorId));
      });
      isAuthorOpen = true;
      body.classList.remove("mobile-menu-open");
      body.classList.add("reading-question");
      const profile = authorProfiles[authorId];
      const profileText = profile?.text || (collectiveMembers.has(authorId) ? collectiveProfile(authorName) : "");
      introContainer.innerHTML = `
        <article class="entry-article author-entry">
          <h1 id="page-title">${profile?.name || authorName}</h1>
          ${profileText}
          <h2>En esta entrada</h2>
          <ul>${relatedQuestions.map((question) => `<li>${question.textContent.trim()}</li>`).join("")}</ul>
        </article>`;
      introPane.scrollTop = 0;
    }

    function enterRepresentation() {
      previousView = activeHomeView();
      isEntryOpen = true;
      currentQuestionButton = null;
      homeNav.hidden = true;
      entryNav.hidden = false;
      panelViews.forEach((view) => { view.hidden = view.id !== "entry-view"; });
      renderRepresentationIntro();
      setEntrySection("questions");
      body.classList.add("has-subview");
    }

    function leaveEntry() {
      isEntryOpen = false;
      isAuthorOpen = false;
      currentQuestionButton = null;
      entryNav.hidden = true;
      homeNav.hidden = false;
      panelViews.forEach((view) => { view.hidden = view.id !== `${previousView}-view`; });
      homeNavButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === previousView)));
      renderHome();
      body.classList.remove("has-subview");
      body.classList.remove("reading-question", "mobile-menu-open");
    }

    function showView(name) {
      searchInput.value = "";
      glossaryButtons.forEach((button) => { button.closest("li").hidden = false; });
      panelViews.forEach((view) => { view.hidden = view.id !== `${name}-view`; });
      homeNavButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === name)));
      body.classList.remove("has-subview");
    }

    categoryToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const wasOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!wasOpen));
        toggle.querySelector(".category-icon").textContent = wasOpen ? "+" : "−";
        document.querySelector(`#${toggle.getAttribute("aria-controls")}`).hidden = wasOpen;
      });
    });

    searchInput.addEventListener("input", () => {
      const query = normalizeText(searchInput.value.trim());
      glossaryButtons.forEach((button) => {
        const belongsToActiveView = !button.closest(".panel-view").hidden;
        const matches = normalizeText(button.textContent).includes(query);
        button.closest("li").hidden = !matches || !belongsToActiveView;
        if (matches && query && belongsToActiveView) {
          const list = button.closest(".concept-list");
          list.hidden = false;
          const toggle = document.querySelector(`[aria-controls="${list.id}"]`);
          toggle.setAttribute("aria-expanded", "true");
          toggle.querySelector(".category-icon").textContent = "−";
        }
      });
      body.classList.remove("has-subview");
    });

    homeNavButtons.forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
      entryNavButtons.forEach((button) => button.addEventListener("click", () => {
        const view = button.dataset.entryView;
        const isMobileMenu = window.matchMedia("(max-width: 820px)").matches
          && body.classList.contains("reading-question")
          && view !== "rae";

        if (isMobileMenu) {
          const closeCurrentMenu = button.getAttribute("aria-pressed") === "true"
            && body.classList.contains("mobile-menu-open");
          setEntrySection(view);
          body.classList.toggle("mobile-menu-open", !closeCurrentMenu);
          return;
        }

        setEntrySection(view);
        currentQuestionButton = null;
        if (view === "rae") {
          renderRaeEntry();
        } else {
          renderRepresentationIntro();
        }
      }));
    questionButtons.forEach((button) => button.addEventListener("click", () => renderQuestion(button)));
    authorButtons.forEach((button) => button.addEventListener("click", () => renderAuthor(button)));
    glossaryButtons.forEach((button) => {
      if (normalizeText(button.textContent) === "representacion") {
        button.addEventListener("click", enterRepresentation);
      }
    });

    backButton.addEventListener("click", () => {
      if (isAuthorOpen && currentQuestionButton) {
        renderQuestion(currentQuestionButton, false);
      } else if (isAuthorOpen) {
        renderRepresentationIntro();
      } else if (isQuestionOpen) {
        renderRepresentationIntro();
      } else if (isEntryOpen) {
        leaveEntry();
      }
    });
  