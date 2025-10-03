interface RawFeedItem {
	title?: string;
	link?: string;
	guid?: string;
	content?: string;
	contentSnippet?: string;
	isoDate?: string;
	pubDate?: string;
	enclosure?: { url?: string };
}

const normalizeFeedItems = (items: RawFeedItem[]) => {
	return items.map((item) => ({
		title: item.title,
		link: item.link,
		guid: item.guid,
		content: item.content,
		contentSnippet: item.contentSnippet || item.content || "",
		isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
		image: item.enclosure?.url || "",
	}));
};

export default normalizeFeedItems;
