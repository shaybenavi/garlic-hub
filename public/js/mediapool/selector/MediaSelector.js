/*
 garlic-hub: Digital Signage Management Platform

 Copyright (C) 2025 Nikolaos Sagiadinos <garlic@saghiadinos.de>
 This file is part of the garlic-hub source code

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License, version 3,
 as published by the Free Software Foundation.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import {EventEmitter} from "../../core/EventEmitter.js";

export class MediaSelector
{
	#filter = "";
	#selectedMediaId = 0;
	#selectedMediaLink = "";
	#emitter = new EventEmitter();

	#treeViewWrapper  = {};
	#mediaService = {};
	#selectorView = {};
	#isMultiselect = false;
	#selectionAnchor = null; // last plainly clicked item, start of a Shift+click range

	constructor(treeViewWrapper, mediaService, selectorView)
	{
		this.#treeViewWrapper = treeViewWrapper;
		this.#mediaService = mediaService;
		this.#selectorView = selectorView;

		this.#initEvents();
	}

	enableMultiSelect()
	{
		this.#isMultiselect = true;
	}

	disableMultiSelect()
	{
		this.#isMultiselect = false;
	}

	set filter(value)
	{
		this.#filter = value;
	}

	getMediaItemsContainer()
	{
		return this.#selectorView.getMediaListElement();
	}

	getMediaItems()
	{
		return this.#selectorView.mediaItems;
	}

	get selectedMediaId()
	{
		return this.#selectedMediaId;
	}

	get selectedMediaLink()
	{
		return this.#selectedMediaLink;
	}

	on(eventName, listener)
	{
		return this.#emitter.on(eventName, listener);
	}

	off(eventName, listener)
	{
		return this.#emitter.off(eventName, listener);
	}

	/**
	 * Selected items in the order they appear in the grid.
	 */
	getSelectedMedia()
	{
		return this.#selectedElements().map(article => ({
			id: article.dataset.mediaId,
			src: article.querySelector('img').src
		}));
	}

	getSelectedIds()
	{
		return this.#selectedElements().map(article => article.dataset.selectId ?? article.dataset.mediaId);
	}

	clearSelection()
	{
		this.#selectedElements().forEach(el => el.classList.remove('selected'));
		this.#selectionAnchor = null;
	}

	// kept for callers using the lowercase spelling
	enableMultiselect()
	{
		this.enableMultiSelect();
	}

	disableMultiselect()
	{
		this.disableMultiSelect();
	}


	async showSelector(element)
	{
		element.replaceChildren(this.#selectorView.loadSelectorTemplate());
		this.#treeViewWrapper.initTree();
		this.#selectionAnchor = null;

		const mediaList = document.getElementById('mediaList');
		mediaList.addEventListener('click', (e) => this.#onItemClick(e, mediaList));
	}

	/**
	 * Single-select mode: click toggles the one item.
	 * Multi-select mode:  click toggles the item (checkbox behaviour, no modifier needed),
	 *                     Shift+click selects the range from the last clicked item,
	 *                     click on empty grid space clears the selection.
	 */
	#onItemClick(e, mediaList)
	{
		const item = e.target.closest('.media-item');

		if (!item)
		{
			if (this.#isMultiselect && e.target === mediaList)
				this.clearSelection();
			return;
		}

		if (!this.#isMultiselect)
		{
			this.#selectedElements().forEach(el => { if (el !== item) el.classList.remove('selected'); });
			item.classList.toggle('selected');
			this.#selectionAnchor = item.classList.contains('selected') ? item : null;
			return;
		}

		if (e.shiftKey && this.#selectionAnchor !== null && this.#selectionAnchor.isConnected)
		{
			const items = [...mediaList.querySelectorAll('.media-item')];
			const from  = items.indexOf(this.#selectionAnchor);
			const to    = items.indexOf(item);
			const [start, end] = from < to ? [from, to] : [to, from];
			for (let i = start; i <= end; i++)
				items[i].classList.add('selected');
			// anchor stays put so a second Shift+click extends from the same origin
			return;
		}

		item.classList.toggle('selected');
		this.#selectionAnchor = item;
	}

	#selectedElements()
	{
		const mediaList = this.#selectorView.getMediaListElement();
		if (mediaList === null)
			return [];

		return [...mediaList.querySelectorAll('.media-item.selected')];
	}

	async loadMedia(nodeId)
	{
		return await this.#mediaService.loadFilteredMediaByNodeId(nodeId, this.#filter);
	}

	displayMediaList(mediaList)
	{
		this.#selectorView.displayMediaList(mediaList);
		this.#selectionAnchor = null; // the grid was rebuilt, old anchor element is gone
	}

	#initEvents()
	{
		this.#treeViewWrapper.on("treeview:loadMediaInDirectory", async (args) =>
		{
			const results = await this.loadMedia(args.node_id);
			this.displayMediaList(results);
			this.#emitter.emit('mediapool:selector:loaded', {nodeId: args.node_id });
		});
	}
}
