QBCore = exports["qb-core"]:GetCoreObject()

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
end)

RegisterNetEvent("v-sharedlist:client:openList", function()
    SendNUIMessage ({
        type = 'v-sharedlist',
        vehicles = QBCore.Shared.Vehicles,
        items = QBCore.Shared.Items,
        weapons = QBCore.Shared.Weapons,
        jobs = QBCore.Shared.Jobs,
        gangs = QBCore.Shared.Gangs
    })
    SetNuiFocus(true, true)
end)