import { NfReceivedService } from '../service/NfReceivedService'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { NfReceived } from '../model/NfReceived'
import { Users } from '../model/User'
import { Supplier } from '../model/Supplier'
import { httpError } from '../errors/HttpError'

jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}))

// mockQueryBuilder separado para tipar corretamente
const mockQueryBuilder: Partial<SelectQueryBuilder<NfReceived>> = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn()
}

const mockRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder as SelectQueryBuilder<NfReceived>)
} as unknown as Repository<NfReceived>

describe('NfReceivedService', () => {
  let service: NfReceivedService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new NfReceivedService(mockRepository)
  })

  describe('insert', () => {
    it('deve lançar erro se campos obrigatórios estiverem ausentes', async () => {
      const nf = { nf_value: 0, type_nf: '', status: '', tickets: null } as unknown as NfReceived

      await expect(service.insert(nf, '123', '456')).rejects.toThrow(httpError)
    })

    it('deve lançar erro se usuário ou fornecedor não forem encontrados', async () => {
        const { AppDataSource } = require('../data-source')

        // Simula o AppDataSource retornando `null` duas vezes (User e Supplier)
        AppDataSource.getRepository
            .mockReturnValueOnce({ findOneBy: jest.fn().mockResolvedValue(null) }) // supplier
            .mockReturnValueOnce({ findOneBy: jest.fn().mockResolvedValue(null) }) // user

        const nf = {
            nf_value: 100,
            type_nf: 'entrada',
            status: 'pendente',
            tickets: []
        } as unknown as NfReceived

        await expect(service.insert(nf, '123', '456')).rejects.toThrow(httpError)
    })
    
    it('deve salvar a nota fiscal corretamente', async () => {
      const { AppDataSource } = require('../data-source')

      AppDataSource.getRepository
        .mockReturnValueOnce({ findOneBy: jest.fn().mockResolvedValue({} as Supplier) }) // supplier
        .mockReturnValueOnce({ findOneBy: jest.fn().mockResolvedValue({} as Users) }) // user

      const nf = {
        nf_value: 200,
        type_nf: 'entrada',
        status: 'pendente',
        tickets: [{ ticket_value: 50, due_date: '2025-10-10' }]
      } as unknown as NfReceived

      mockRepository.save = jest.fn().mockResolvedValue(nf)

      const result = await service.insert(nf, 'supplierId', 'userId')
      expect(result).toEqual(nf)
      expect(mockRepository.save).toHaveBeenCalled()
    })
  })

  describe('findByIdNf', () => {
    it('deve retornar nota fiscal ao encontrar', async () => {
      const nf = { id_nf: 'abc' } as NfReceived

      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(nf)
      } as Partial<SelectQueryBuilder<NfReceived>>

      mockRepository.createQueryBuilder = jest.fn(() => mockQB as SelectQueryBuilder<NfReceived>)

      const result = await service.findByIdNf('abc', '12345678000100')
      expect(result).toEqual(nf)
    })

    it('deve lançar erro se não encontrar a nota fiscal', async () => {
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      } as Partial<SelectQueryBuilder<NfReceived>>

      mockRepository.createQueryBuilder = jest.fn(() => mockQB as SelectQueryBuilder<NfReceived>)

      await expect(service.findByIdNf('abc', '123')).rejects.toThrow(httpError)
    })
  })
})
