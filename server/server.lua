QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Commands.Add("sharedlist", "Open Shared List", {}, false, function(source)
	TriggerClientEvent('v-sharedlist:client:openList', source)
end, 'mod')