import * as sys from 'systeminformation'
import { WebServer } from './server/webserver'
import { Application } from 'express'
import { ApiResponseModel } from './models/ApiResponseModel'
import { DiskInfoModel, SystemInfoModel } from './models/SystemInfoModel'
import { AuthenticationModel, AuthenticationSchema } from './models/AuthenticationModel'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'

const webServer: WebServer = new WebServer(9090)
const application: Application = webServer._application()

/**
 * Database Client
 */
const prismaClient: PrismaClient = new PrismaClient()

application.post('/system', async function (request, response) {

    /**
     * Authentication Schema assert
     */
    const body: AuthenticationModel = request.body
    const result: Joi.ValidationResult = AuthenticationSchema.validate(body)
    if (result.error) {
        return response.json({
            success: false
        })
    }

    const userResult = await prismaClient.authorizedTokens.findFirst({
        where: {
            api_token: body.api_token
        }
    })

    if (!userResult) {
        return response.json({
            success: false
        })
    }

    /**
     * Responding with system info
     */
    const cpu: sys.Systeminformation.CpuData = await sys.cpu()
    const memory: sys.Systeminformation.MemData = await sys.mem()
    const disks: sys.Systeminformation.FsSizeData[] = await sys.fsSize()
    const currentLoad: sys.Systeminformation.CurrentLoadData = await sys.currentLoad()

    /**
     * Create Api Response Model
     */
    const freeMemory: number = parseFloat((memory.free / 1073741824).toFixed(1))
    const totalMemory: number = parseFloat((memory.total / 1073741824).toFixed(1))
    const usedMemory: number = parseFloat((memory.used / 1073741824).toFixed(1))

    /**
     * Getting system info
     */
    const diskArray: DiskInfoModel[] = []

    disks.forEach(async (disk: sys.Systeminformation.FsSizeData) => {
        /**
         * Generate Layout
         */
        diskArray.push({
            name: disk.mount,
            size: parseFloat((disk.size / 1073741824).toFixed(1)),
            usedSize: parseFloat((disk.used / 1073741824).toFixed(1))
        })
    })

    const apiResponse: ApiResponseModel<SystemInfoModel> = {
        success: true,
        response: {
            cpu: {
                brand: cpu.brand,
                cores: cpu.cores,
                speed: cpu.speed,
                currentLoad: parseFloat(currentLoad.cpus[0].load.toFixed(1))
            },
            memory: {
                freeMemory: freeMemory,
                totalMemory: totalMemory,
                usedMemory: usedMemory
            },
            disks: diskArray
        }
    }

    response.json(apiResponse)

})

webServer.listen()

function format(message: string, replacement: string[]): string {
    var i = 0
    while (message.includes('{}')) {
        message = message.replace('{}', replacement[i])
        i++
    }
    return message
}