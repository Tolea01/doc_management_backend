import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserItemDto } from './dto/user-item.dto';
import ParamApiOperation from 'common/decorators/swagger/param.api.operation';
import QueryApiOperation from 'common/decorators/swagger/query.api.operation';
import { Pagination } from 'nestjs-typeorm-paginate';
import paginationConfig from 'src/config/pagination.config';
import { SortOrder } from 'database/validators/typeorm.sort.validator';
import { UserSort } from './validators/user.sort.validator';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from './roles/role.enum';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';

@ApiTags('Users')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Requires ADMIN role to create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserItemDto> {
    return this.userService.create(createUserDto);
  }

  @Get('list')
  @Role(UserRole.ALL)
  @ApiOperation({
    summary: 'Get a list of users',
    description: 'Accessible by ALL users',
  })
  @ParamApiOperation('user')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', 'Object', 'filters users')
  @ApiResponse({ status: 200, description: 'Return list of users' })
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
    sortColumn: UserSort,
    @Query('filter') filter: Record<string, any>,
  ): Promise<Pagination<UserItemDto>> {
    return this.userService.findAll(limit, page, sortOrder, sortColumn, filter);
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Requires ADMIN role to get a user by ID',
  })
  @ApiResponse({ status: 200, description: 'User has been found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserItemDto | undefined> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update user by id',
    description: 'Requires ADMIN role to update a user by ID',
  })
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User has been updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Requires ADMIN role to delete a user by ID',
  })
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User has been deleted' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
