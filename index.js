document.addEventListener("DOMContentLoaded", () => {
	// ==== ФИЛЬТР + СОРТИРОВКА ====
	const filterButtons = document.querySelectorAll(".navigation-link");
	const sortButton = document.getElementById("sort");
	const cardsWrapper = document.getElementById("body");

	let currentFilter = "all";
	let sortAsc = true;

	const allCards = Array.from(document.querySelectorAll(".cards-container"));

	function renderCards() {
		let filteredCards = allCards.filter(card => {
			return currentFilter === "all" || card.dataset.cat === currentFilter;
		});

		filteredCards.sort((a, b) => {
			const dateA = parseInt(a.dataset.eventDate);
			const dateB = parseInt(b.dataset.eventDate);
			return sortAsc ? dateA - dateB : dateB - dateA;
		});

		allCards.forEach(card => card.style.display = "none");
		filteredCards.forEach(card => {
			cardsWrapper.appendChild(card);
			card.style.display = "block";
		});
	}

	filterButtons.forEach(button => {
		button.addEventListener("click", () => {
			currentFilter = button.dataset.filter;
			filterButtons.forEach(btn => btn.classList.remove("active"));
			button.classList.add("active");
			renderCards();
		});
	});

	sortButton.addEventListener("click", () => {
		sortAsc = !sortAsc;
		sortButton.textContent = sortAsc ? "RELEASE DATE ↑" : "RELEASE DATE ↓";
		renderCards();
	});

	document.querySelector('[data-filter="all"]').classList.add("active");
	renderCards();

	// ==== МОДАЛКИ ====

	const modalConfirmWindow = document.getElementById("modal"); // Окно подтверждения
	const modalText = document.getElementById("modal-text");
	const confirmModal = document.getElementById("modal-confirm"); // Кнопка Confirm
	const closeModal = document.getElementById("modal-close");

	const modalEdit = document.getElementById("modal-edit");
	const editForm = document.getElementById("edit-form");
	const editTitle = document.getElementById("edit-title");
	const editYear = document.getElementById("edit-year");
	const editDesc = document.getElementById("edit-desc");

	const confirmEditBtn = document.getElementById("modal-confirm-edit");
	const cancelEditBtn = document.getElementById("modal-edit-close");
	const closeEditModalBtn = document.getElementById("modal-edit-close");

	let currentCard = null;
	let pendingAction = "";

	// ==== ДОБАВЛЕНИЕ БУРГЕР-МЕНЮ ====

	allCards.forEach(card => {
		const burger = document.createElement("div");
		burger.classList.add("burger-menu");

		for (let i = 0; i < 3; i++) {
			const line = document.createElement("span");
			burger.appendChild(line);
		}

		const dropdown = document.createElement("div");
		dropdown.classList.add("burger-dropdown");

		const options = ["Edit", "Delete"];
		options.forEach(text => {
			const btn = document.createElement("button");
			btn.textContent = text;

			btn.addEventListener("click", (e) => {
				e.stopPropagation();
				currentCard = card;
				pendingAction = text;

				modalText.textContent = text === "Delete"
					? "Are you sure you want to delete this card?"
					: "Open editor for this card?";
				modalConfirmWindow.style.display = "flex";
			});

			dropdown.appendChild(btn);
		});

		card.appendChild(burger);
		card.appendChild(dropdown);

		burger.addEventListener("click", (e) => {
			e.stopPropagation();
			dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
		});

		document.addEventListener("click", () => {
			dropdown.style.display = "none";
		});

		dropdown.addEventListener("click", e => e.stopPropagation());
	});

	// ==== ОБРАБОТКА МОДАЛОК ====

	confirmModal.addEventListener("click", () => {
		modalConfirmWindow.style.display = "none";

		if (!currentCard) return;

		if (pendingAction === "Edit") {
			const spans = currentCard.querySelectorAll("span");
			const desc = currentCard.querySelector("p");

			editTitle.value = spans[0].textContent;
			editYear.value = spans[1].textContent;
			editDesc.textContent = desc.textContent;

			modalEdit.style.display = "flex";
		} else if (pendingAction === "Delete") {
			currentCard.remove();
		}
	});

	closeModal.addEventListener("click", () => {
		modalConfirmWindow.style.display = "none";
		currentCard = null;
	});

	cancelEditBtn.addEventListener("click", () => {
		modalEdit.style.display = "none";
		currentCard = null;
	});

	closeEditModalBtn.addEventListener("click", () => {
		modalEdit.style.display = "none";
		currentCard = null;
	});

	editForm.addEventListener("submit", (e) => {
		e.preventDefault();
		if (!currentCard) return;

		const spans = currentCard.querySelectorAll("span");
		const desc = currentCard.querySelector("p");

		spans[0].textContent = editTitle.value;
		spans[1].textContent = editYear.value;
		desc.textContent = editDesc.value;

		modalEdit.style.display = "none";
		currentCard = null;
	});
});
