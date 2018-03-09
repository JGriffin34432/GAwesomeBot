const { setupPage, setupDashboardPage } = require("../helpers");
const controllers = require("../controllers");

module.exports = router => {
	// Admin console support for legacy URL's
	router.use("/", (req, res, next) => {
		if (req.query.svrid) {
			res.redirect(307, `/dashboard/${req.query.svrid}${req.path}`);
		} else {
			return next();
		}
	});

	// Dashboard
	setupPage(router, "/", [], controllers.dashboard.home);
	setupDashboardPage(router, "/overview", [], controllers.dashboard.overview);

	// Commands
	setupDashboardPage(router, "/commands/command-options", [], controllers.dashboard.commands.options);
	setupDashboardPage(router, "/commands/command-list", [], controllers.dashboard.commands.list);
	setupDashboardPage(router, "/commands/rss-feeds", [], controllers.dashboard.commands.rss);
	setupDashboardPage(router, "/commands/streamers", [], controllers.dashboard.commands.streamers);
	setupDashboardPage(router, "/commands/tags", [], controllers.dashboard.commands.tags);
	setupDashboardPage(router, "/commands/auto-translation", [], controllers.dashboard.commands.translation);
	setupDashboardPage(router, "/commands/trivia-sets", [], controllers.dashboard.commands.trivia);
	setupDashboardPage(router, "/commands/api-keys", [], controllers.dashboard.commands.APIKeys);
	setupDashboardPage(router, "/commands/tag-reaction", [], controllers.dashboard.commands.reaction);

	// Stats and Points
	setupDashboardPage(router, "/stats-points/stats-collection", [], controllers.dashboard.stats.collection);
	setupDashboardPage(router, "/stats-points/ranks", [], controllers.dashboard.stats.ranks);
	setupDashboardPage(router, "/stats-points/gawesome-points", [], controllers.dashboard.stats.points);

	// Administration
	setupDashboardPage(router, "/administration/admins", [], controllers.dashboard.administration.admins);
};
