const computeRankScore = require("./RankScoreCalculator.js");

/**
 * Clear activity stats for a server
 * @param bot The bot instance
 * @param db The database instance
 * @param {guild} server The server whos stats get cleared
 * @param serverDocument The Server Document
 */
/* eslint-disable max-len */
module.exports = async (bot, db, server, serverDocument) => {
	// Rank members by activity score for the week
	const topMembers = [];
	serverDocument.members.forEach(async memberDocument => {
		const member = server.members.get(memberDocument._id);
		if (member && member.id !== bot.user.id && !member.user.bot) {
			const activityScore = computeRankScore(memberDocument.messages, memberDocument.voice);
			topMembers.push([member, activityScore]);
			memberDocument.rank_score += activityScore / 10;
			memberDocument.rank = await bot.checkRank(server, serverDocument, member, memberDocument, true);
			memberDocument.messages = 0;
			memberDocument.voice = 0;
			// TODO: Don't we need to save?
		} else {
			memberDocument.remove();
		}
	});
	topMembers.sort((a, b) => a[1] - b[1]);

	/**
	 * Award points to Top 3
	 * @param member The affected member
	 * @param {?number} amount The amount of points to give the member
	 */
	const awardPoints = async (member, amount) => {
		const userDocument = await db.users.findOrCreate({ _id: member.id }).catch(err => {
			winston.warn(`Failed to find or create user data for "${member.user.tag}" to award activity points on server "${server}"`, { usrid: member.id }, err);
		});
		if (userDocument) {
			userDocument.points += amount;
			userDocument.save(userErr => {
				if (userErr) winston.warn(`Failed to save user document for activity points`, { usrid: member.id }, userErr);
			});
		}
	};
	if (serverDocument.config.commands.points.isEnabled && server.members.size > 2) {
		const promiseArray = [];
		for (let i = topMembers.length - 1; i > topMembers.length - 4; i--) {
			if (i >= 0) {
				promiseArray.push(awardPoints(topMembers[i][0], topMembers[i][1]));
			}
		}
		await Promise.all(promiseArray);
	}
};