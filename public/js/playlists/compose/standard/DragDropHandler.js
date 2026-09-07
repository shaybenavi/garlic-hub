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

import {PlaylistsProperties} from "./playlists/PlaylistsProperties.js";

export class DragDropHandler
{
	#dropTarget  = null;
	#dropSource  = null;
	#dragItem    = null;
	#itemService = null;
	#itemList    = null;
	#items   = null;
	#drake        = null;
	#playlistId     = 0;
	#source         = "";

	constructor(dropTarget, itemService, itemList)
	{
		this.#dropTarget  = dropTarget;
		this.#itemService = itemService;
		this.#itemList    = itemList;
		this.preparePlaylistDragDrop();
	}


	set playlistId(value)
	{
		this.#playlistId = value;
	}

	addDropSource(value)
	{
		this.#dropSource = value;
		this.#drake.destroy();
		this.#drake = null;
		this.preparePlaylistDragDrop(true);
	}

	set source(value)
	{
		this.#source = value;
	}

	set items(value)
	{
		this.#items = value;
	}

	preparePlaylistDragDrop(hasDropSource = false)
	{
		const options = {
			copy: (el) =>{ // copy allowed only if source is another container
				return el.hasAttribute("data-select-id") === true;
			},
			accepts: (el, target, source) => {
				if (source === this.#dropSource)
					return target === this.#dropTarget;

				return source === this.#dropTarget && target === this.#dropTarget;

			}
		};

		let dropContainers = [this.#dropTarget];
		if (hasDropSource === true)
			dropContainers.push(this.#dropSource);

		this.#drake   = dragula(dropContainers, options)
			.on('drag', (el, source) => {
				if (source === this.#dropSource)
					this.#dragItem = this.#items[el.getAttribute('data-select-id')];
			})
			.on('cloned', (clone, original, type) => {
				// Badge the floating mirror with how many items the drop will insert.
				if (type !== 'mirror')
					return;
				const count = this.#collectDragIds(original).length;
				if (count > 1)
					clone.setAttribute('data-drag-count', String(count));
			})
			.on('shadow', (el) => {
					el.classList.add('dragula-shadow');
			})
			.on('drop', async (el, target, source, sibling) => {
				if (target === null)
					return; // prevent error when drop is canceled

				if (source === target)
				{
					const itemsPosition = {};
					Array.from(target.children).forEach((child, index) =>
					{
						itemsPosition[index + 1] = child.getAttribute('id').split('-')[1];
					});
					// for debug onlyconsole.log(itemsPosition);

					await this.#itemService.updateItemsOrders(this.#playlistId, itemsPosition);
					PlaylistsProperties.notifySave();
					return;
				}

				let droppedIndex;
				if (sibling === null) // element dropped at end of list
				{
					droppedIndex = target.children.length;
				}
				else // Element dropped before 'sibling'
				{
					// We find the index of 'sibling' in the  'target'-Container
					droppedIndex = Array.from(target.children).indexOf(sibling);
				}
				// The dropped `el` is dragula's copy inside the playlist; take it out first so
				// the indexes used below refer to real playlist items only.
				const ids = this.#collectDragIds(el);
				el.remove();

				let result = null;
				let inserted = 0;
				for (const id of ids)
				{
					const position = droppedIndex + inserted;
					switch (this.#source)
					{
						case "mediapool":
							result = await this.#itemService.insertMedia(id, this.#playlistId, position);
							break;
						case "playlists":
							result = await this.#itemService.insertPlaylist(id, this.#playlistId, position);
							break;
						case "templates":
							result = await this.#itemService.insertTemplate(id, this.#playlistId, position);
							break;
						default:
							throw new Error("Unknown source");
					}

					if (!result?.data?.item)
						continue; // server rejected this one; keep going with the rest

					this.#itemList.createPlaylistItem(result.data.item, position);
					inserted++;
				}

				if (inserted === 0)
					return;

				this.#itemList.displayPlaylistMetrics(result.data.playlist_metrics);
				PlaylistsProperties.notifySave();
				this.#clearSourceSelection();
			});
	}

	/**
	 * Which source ids a drag of `el` stands for.
	 * If the dragged thumbnail is one of several selected items, the whole selection
	 * (in grid order) is inserted; otherwise just the dragged item.
	 */
	#collectDragIds(el)
	{
		const draggedId = el.getAttribute('data-select-id');
		if (draggedId === null)
			return [];

		if (this.#dropSource === null || !el.classList.contains('selected'))
			return [draggedId];

		const selectedIds = Array.from(this.#dropSource.querySelectorAll('.selected[data-select-id]'))
			.map(item => item.getAttribute('data-select-id'));

		if (selectedIds.length === 0 || !selectedIds.includes(draggedId))
			return [draggedId];

		return selectedIds;
	}

	#clearSourceSelection()
	{
		if (this.#dropSource === null)
			return;

		this.#dropSource.querySelectorAll('.selected').forEach(item => item.classList.remove('selected'));
	}
}