function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

function addWorkshopCollection(eleventyConfig, academicYear) {
	const jsCollectionName = `workshops_${academicYear.replace('-', '_')}`;
	eleventyConfig.addCollection(jsCollectionName, api => {
		const workshops = api.getAll().filter((event) => event.data.academic_year === academicYear);
		workshops.sort((a, b) => a.data.workshop_date - b.data.workshop_date);
		return workshops;
	});
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy('static');

	addWorkshopCollection(eleventyConfig, '20-21');
	addWorkshopCollection(eleventyConfig, '21-22');
	addWorkshopCollection(eleventyConfig, '22-23');
};
