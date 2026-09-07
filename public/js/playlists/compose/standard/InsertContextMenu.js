export class InsertContextMenu
{
	#insertMenuSelect        = document.getElementById("insertMenuSelect");
	#selectorFactory         = null;
	#dragDropHandler         = null;
	#itemSelectContainer     = document.getElementById("itemSelectContainer");
	#selectionListener       = null;

	constructor(selectorFactory, dragDropHandler)
	{
		this.#selectorFactory = selectorFactory;
		this.#dragDropHandler = dragDropHandler;
	}

	init()
	{
		this.#insertMedia();
		this.#insertMenuSelect.addEventListener("change",  (e) =>
		{
			const selectedValue = e.target.value;

			switch (selectedValue)
			{
				case "insertMedia":
					this.#insertMedia()
					break;
				case "insertExternalMedia":
					this.#insertExternalMedia()
					break;
				case "insertPlaylists":
					this.#insertPlaylists();
					break;
				case "insertExternalPlaylists":
					this.#insertExternalPlaylists()
					break;
				case "insertTemplates":
					this.#insertTemplates();
					break
				case "insertChannels":
					this.#insertChannels();
					break;
				default:
					throw new Error("Unknown insert menu option");
			}
		});
	}

	async #insertMedia()
	{
		const selector = this.#selectorFactory.create("mediapool");
		selector.enableMultiSelect(); // click several thumbnails, then add or drag into the playlist
		await selector.showSelector(this.#itemSelectContainer);
		this.#dragDropHandler.source = "mediapool";
		this.#dragDropHandler.items = selector.getMediaItems();
		const container = selector.getMediaItemsContainer();
		this.#dragDropHandler.addDropSource(container);
		this.#wireAddSelectedButton(selector);
	}

	#wireAddSelectedButton(selector)
	{
		const button = document.getElementById("addSelectedToPlaylist");
		const countEl = document.getElementById("mediaSelectionCount");
		const container = selector.getMediaItemsContainer();
		if (button === null)
			return;

		if (this.#selectionListener !== null)
			selector.off("mediapool:selector:selectionChanged", this.#selectionListener);

		const syncButton = ({ count }) =>
		{
			button.disabled = count < 1;
			if (countEl === null)
				return;
			if (count < 1)
			{
				countEl.hidden = true;
				countEl.textContent = "";
			}
			else
			{
				countEl.hidden = false;
				countEl.textContent = String(count);
			}
		};

		this.#selectionListener = syncButton;
		selector.on("mediapool:selector:selectionChanged", syncButton);
		if (container !== null)
			container.addEventListener("mediapool:selectioncleared", () => syncButton({ count: 0 }));
		syncButton({ count: selector.getSelectedIds().length });

		button.onclick = async () =>
		{
			const ids = selector.getSelectedIds();
			if (ids.length === 0)
				return;

			button.disabled = true;
			try
			{
				await this.#dragDropHandler.insertIds(ids);
				selector.clearSelection();
			}
			catch (err)
			{
				alert(err?.message || "Could not add to playlist");
			}
			finally
			{
				syncButton({ count: selector.getSelectedIds().length });
			}
		};
	}

	async #insertExternalMedia()
	{
		alert("Insert external media");
	}

	async #insertPlaylists()
	{
		const selector = this.#selectorFactory.create("playlists");
		await selector.showSelector(this.#itemSelectContainer);
		this.#dragDropHandler.source = "playlists";
		this.#dragDropHandler.items = selector.items;
		const container = selector.getItemsContainer();
		this.#dragDropHandler.addDropSource(container);
	}

	async #insertExternalPlaylists()
	{
		alert("Insert external playlists");
	}

	async #insertTemplates()
	{
		const selector = this.#selectorFactory.create("templates");
		await selector.showSelector(this.#itemSelectContainer);
		this.#dragDropHandler.source = "templates";
		this.#dragDropHandler.items = selector.items;
		const container = selector.getItemsContainer();
		this.#dragDropHandler.addDropSource(container);
	}
	async #insertChannels()
	{
		alert("Insert channels");
	}
}
