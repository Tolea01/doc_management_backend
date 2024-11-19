import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import { ApiLanguageHeader } from 'app/common/decorators/swagger/language-header';
import ParamApiOperation from 'app/common/decorators/swagger/param.api.operation';
import QueryApiOperation from 'app/common/decorators/swagger/query.api.operation';
import { Pagination } from 'nestjs-typeorm-paginate';
import paginationConfig from 'src/config/pagination.config';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { UserRole } from '../user/roles/role.enum';
import { CreatePersonDto } from './dto/create-person.dto';
import { PersonFilterDto } from './dto/person-filter.dto';
import { PersonItemDto } from './dto/person-item.dto';
import { PersonResponseDto } from './dto/person-response.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { PersonSort } from './validators/person.sort.validator';

@ApiTags('Persons')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('person')
@Role(UserRole.DIRECTOR, UserRole.ADMIN, UserRole.SECRETARY)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create a new person',
    description: 'Accessible by director, admin,  users',
  })
  @ApiResponse({
    status: 201,
    description: 'The person has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Person already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(
    @Body() createPersonDto: CreatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personService.create(createPersonDto);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get a list of persons',
    description: 'Accessible by ALL users',
  })
  @ParamApiOperation('person')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', PersonFilterDto, 'filters persons')
  @ApiResponse({ status: 200, description: 'Return list of persons' })
  @ApiResponse({
    status: 500,
    description: 'Error when searching for parameters',
  })
  async findAll(
    @Query('limit', new DefaultValuePipe(paginationConfig.limit), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('sortOrder', new DefaultValuePipe(paginationConfig.sortOrder))
    sortOrder: SortOrder,
    @Query('sortColumn', new DefaultValuePipe(paginationConfig.sortColumn))
    sortColumn: PersonSort,
    @Query('filter') filter: PersonFilterDto,
  ): Promise<Pagination<PersonItemDto>> {
    return this.personService.findAll(
      limit,
      page,
      sortOrder,
      sortColumn,
      filter,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get person by id',
    description: 'Accessible by ALL users',
  })
  @ApiResponse({ status: 200, description: 'Person has been found' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Person | undefined> {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update person by id',
    description: 'Accessible by ALL users',
  })
  @ApiOperation({ summary: 'Update person by id' })
  @ApiResponse({ status: 200, description: 'Person has been updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<UpdatePersonDto> {
    return this.personService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete person by id',
    description: 'Accessible by ALL users',
  })
  @ApiOperation({ summary: 'Delete person by id' })
  @ApiResponse({ status: 200, description: 'Person has been deleted' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.personService.remove(id);
  }
}
