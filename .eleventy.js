function padZero(number) {
	return number < 10 ? `0${number}` : number;
}

function hasTag(item, tag) {
	if (!item.data || !item.data.tags) {
		return false;
	}
	if (Array.isArray(item.data.tags)) {
		return item.data.tags.includes(tag);
	}
	return item.data.tags === tag;
}

function getProjectSortKey(data) {
	const year = Number(data.project_year) || 0;
	const month = data.project_month ? Number(data.project_month) : 12;
	return year * 100 + month;
}

function addWorkshopCollection(eleventyConfig, academicYear) {
	const jsCollectionName = `workshops_${academicYear.replace('-', '_')}`;
	eleventyConfig.addCollection(jsCollectionName, (api) => {
		const workshops = api.getAll().filter((event) => event.data.academic_year === academicYear);
		workshops.sort((a, b) => a.data.workshop_date - b.data.workshop_date);
		return workshops;
	});
}

export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy('static');

	eleventyConfig.addCollection('projects', (api) => {
		const projects = api.getAll().filter((item) => hasTag(item, 'project'));
		projects.sort((a, b) => getProjectSortKey(b.data) - getProjectSortKey(a.data));
		return projects;
	});

	addWorkshopCollection(eleventyConfig, '20-21');
	addWorkshopCollection(eleventyConfig, '21-22');
	addWorkshopCollection(eleventyConfig, '22-23');
	addWorkshopCollection(eleventyConfig, '23-24');
	addWorkshopCollection(eleventyConfig, '24-25');
}
