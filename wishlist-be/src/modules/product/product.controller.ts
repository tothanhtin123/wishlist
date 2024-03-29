import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UseUserGuard } from 'src/common/decorators/use-user-guard.decorator';
import { AuthStrategy } from '../auth/auth.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { User } from 'src/common/decorators/user.decorator';
import {
  UseCreateProductInterceptor,
  UseDeleteProductInterceptor,
  UseGetManyProductsInterceptor,
  UseGetProductInterceptor,
  UseUpdateProductInterceptor,
} from './product.interceptor';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from 'src/common/base/base.dto';

@Controller('product')
@UseUserGuard(AuthStrategy.JWT)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseCreateProductInterceptor()
  create(@Body() createProductDto: CreateProductDto, @User() user: User) {
    return this.productService.create({
      ...createProductDto,
      createdById: user.id,
      updatedById: user.id,
    });
  }

  @Get(':id')
  @UseGetProductInterceptor()
  getOne(@Param('id') id: string) {
    return this.productService.getOneById(id, { relations: ['thumbnail'] });
  }

  @Get()
  @UseGetManyProductsInterceptor()
  getMany(@Query() query: PaginationDto) {
    return this.productService.getAllPaginated({
      ...query,
      relations: ['thumbnail'],
    });
  }

  @Patch(':id')
  @UseUpdateProductInterceptor()
  updateOne(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: User,
  ) {
    return this.productService.updateById(
      id,
      {
        ...updateProductDto,
        updatedById: user.id,
      },
      { relations: ['thumbnail'] },
    );
  }

  @Delete(':id')
  @UseDeleteProductInterceptor()
  deleteOne(@Param('id') id: string) {
    return this.productService.softRemoveById(id);
  }
}
